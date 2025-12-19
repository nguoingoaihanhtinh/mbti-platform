import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { sendAssignmentEmail } from '@/utils/email';
import { AssignmentDetail } from './types';

@Injectable()
export class CompanyService {
  private client: SupabaseClient;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
    this.client = createClient(url, key);
  }

  async subscribePackage(companyId: string, packageCode: string) {
    // 1. Lấy gói mới
    const { data: pkg, error: pkgErr } = await this.client
      .from('packages')
      .select('id, max_assignments')
      .eq('code', packageCode)
      .eq('is_active', true)
      .single();

    if (pkgErr || !pkg) {
      throw new BadRequestException('Gói không tồn tại hoặc đã ngừng');
    }

    // 2. Lấy subscription hiện tại
    const { data: currentSub, error: subErr } = await this.client
      .from('company_subscriptions')
      .select('used_assignments, package_id, carry_over_assignments')
      .eq('company_id', companyId)
      .single();

    let carryOver = 0;

    if (!subErr && currentSub) {
      const { data: oldPkg, error: oldErr } = await this.client
        .from('packages')
        .select('max_assignments')
        .eq('id', currentSub.package_id)
        .single();

      if (!oldErr && oldPkg) {
        const remaining = Math.max(
          0,
          oldPkg.max_assignments - currentSub.used_assignments,
        );
        carryOver = remaining;
      }
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setMonth(endDate.getMonth() + 1);

    const newSubscriptionData = {
      company_id: companyId,
      package_id: pkg.id,
      used_assignments: currentSub?.used_assignments || 0,
      carry_over_assignments: carryOver,
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      status: 'active',
      updated_at: now.toISOString(),
    };

    const { error: upsertErr } = await this.client
      .from('company_subscriptions')
      .upsert(newSubscriptionData, { onConflict: 'company_id' });

    if (upsertErr) throw upsertErr;
  }
  async getCurrentSubscription(companyId: string) {
    const { data: sub, error } = await this.client
      .from('company_subscriptions')
      .select(
        `
        *,
        packages!inner(
          id, name, code, max_assignments, price_per_month, is_active, benefits
        )
      `,
      )
      .eq('company_id', companyId)
      .single();

    if (error) return null;
    return sub;
  }

  async getDashboardStats(companyId: string) {
    const { data: assessments, error: assessErr } = await this.client
      .from('assessments')
      .select('id')
      .eq('company_id', companyId);

    if (assessErr) throw assessErr;

    const assessmentIds = assessments.map((a) => a.id);
    const completedCount = assessmentIds.length;

    let mbtiDistribution: { mbti_type: string; percentage: number }[] = [];
    if (assessmentIds.length > 0) {
      const { data: results, error: resErr } = await this.client
        .from('results')
        .select('mbti_type')
        .in('assessment_id', assessmentIds);

      if (resErr) throw resErr;

      const mbtiCounts = results.reduce(
        (acc, r) => {
          acc[r.mbti_type] = (acc[r.mbti_type] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const total = results.length;
      mbtiDistribution = Object.entries(mbtiCounts).map(([type, count]) => ({
        mbti_type: type,
        percentage:
          total > 0
            ? parseFloat((((count as number) / total) * 100).toFixed(1))
            : 0,
      }));
    }

    const subscription = await this.getCurrentSubscription(companyId);

    const totalQuota =
      (subscription?.packages.max_assignments || 0) +
      (subscription?.carry_over_assignments || 0);

    return {
      total_completed: completedCount,
      mbti_distribution: mbtiDistribution,
      quota: {
        used: subscription?.used_assignments || 0,
        max: totalQuota,
        package_name: subscription?.packages.name || 'Chưa đăng ký',
      },
    };
  }

  async createAssignment(
    companyId: string,
    candidateEmail: string,
    candidateFullname: string,
    testId: string,
    note?: string,
  ) {
    const subscription = await this.getCurrentSubscription(companyId);
    if (!subscription) {
      throw new BadRequestException('Vui lòng đăng ký gói trước khi gửi test');
    }

    const totalQuota =
      (subscription.packages.max_assignments || 0) +
      (subscription.carry_over_assignments || 0);
    if (subscription.used_assignments >= totalQuota) {
      throw new BadRequestException(`Đã đạt giới hạn ${totalQuota} lượt gửi`);
    }

    const { data: test, error: testErr } = await this.client
      .from('tests')
      .select('id')
      .eq('id', testId)
      .single();
    if (testErr || !test) {
      throw new BadRequestException('Test không tồn tại');
    }

    const { data: assessment, error: assessErr } = await this.client
      .from('assessments')
      .insert({
        company_id: companyId,
        test_id: testId,
        status: 'notStarted',
        guest_email: candidateEmail,
        guest_fullname: candidateFullname || 'Guest',
      })
      .select()
      .single();
    if (assessErr) throw assessErr;

    await this.client
      .from('company_subscriptions')
      .update({ used_assignments: subscription.used_assignments + 1 })
      .eq('company_id', companyId);

    const testLink = `https://mbti-platform-web.vercel.app/test?assessmentId=${assessment.id}&candidateEmail=${candidateEmail}`;
    await sendAssignmentEmail(candidateEmail, testLink, note);

    return { success: true, assessmentId: assessment.id };
  }

  async getAssignments(companyId: string, page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: assessments, error } = await this.client
      .from('assessments')
      .select(
        `
      id,
      status,
      created_at,
      completed_at,
      guest_email,
      guest_fullname,
      user:users(id, email, full_name),
      tests(title)
    `,
      )
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const assessmentIds = assessments.map((a) => a.id);
    let resultMap = new Map<string, { mbti_type: string }>();

    if (assessmentIds.length > 0) {
      const { data: results, error: resultsErr } = await this.client
        .from('results')
        .select('assessment_id, mbti_type')
        .in('assessment_id', assessmentIds);

      if (!resultsErr && results) {
        results.forEach((r) => resultMap.set(r.assessment_id, r));
      }
    }

    const normalized = assessments.map((a) => {
      let frontendStatus = 'assigned';
      if (a.status === 'completed') {
        frontendStatus = 'completed';
      } else if (a.completed_at) {
        frontendStatus = 'in_progress';
      }

      return {
        id: a.id,
        status: frontendStatus,
        created_at: a.created_at,
        completed_at: a.completed_at,
        guest_email: a.guest_email,
        guest_fullname: a.guest_fullname,
        user: a.user?.[0] || null,
        test: a.tests?.[0] || null,
        result: resultMap.get(a.id) || null,
      };
    });

    const { count } = await this.client
      .from('assessments')
      .select('id', { count: 'exact' })
      .eq('company_id', companyId);

    return {
      data: normalized,
      total: count || 0,
      page,
      limit,
      total_pages: count ? Math.ceil(count / limit) : 0,
    };
  }

  async getAssignment(assessmentId: string, companyId: string) {
    return this.client
      .from('assessments')
      .select(
        `
        id,
        status,
        completed_at,
        guest_email,
        guest_fullname,
        tests(title), 
        test_id,
        results(
          mbti_type_id,
          mbti_types(type_code, type_name, strengths, weaknesses, career_recommendations)
        )
      `,
      )
      .eq('id', assessmentId)
      .eq('company_id', companyId)
      .single();
  }

  async notifyCandidate(assessmentId: string, companyId: string) {
    const { data: assessment } = await this.getAssignment(
      assessmentId,
      companyId,
    );
    if (!assessment) throw new BadRequestException('Assignment not found');

    const testId = assessment.test_id;
    const candidateEmail = assessment.guest_email;

    if (!testId || !candidateEmail) {
      throw new BadRequestException('Assignment data incomplete');
    }

    const testLink = `https://mbti-platform-web.vercel.app/test?testId=${testId}&candidateEmail=${candidateEmail}`;
    await sendAssignmentEmail(candidateEmail, testLink);

    return { success: true };
  }
  async getCompanyUsers(companyId: string) {
    const { data, error } = await this.client
      .from('users')
      .select('id, email, full_name, created_at')
      .eq('company_id', companyId)
      .is('deleted_at', null);

    if (error) throw error;
    return data;
  }
  async getAssignmentDetail(
    assessmentId: string,
    companyId: string,
  ): Promise<AssignmentDetail> {
    const assessmentRes = await this.getAssignment(assessmentId, companyId);

    if (assessmentRes.error) {
      throw new BadRequestException('Assignment not found');
    }

    const assessment = assessmentRes.data;

    const responsesRes = await this.client
      .from('responses')
      .select('*')
      .eq('assessment_id', assessment.id);

    const testRes = await this.client
      .from('tests')
      .select(
        `
      id,
      title,
      questions!inner(
        id, text, dimension,
        answers!inner(id, text)
      )
    `,
      )
      .eq('id', assessment.test_id)
      .single();

    return {
      assessment,
      responses: responsesRes.data || [],
      test: testRes.data,
    };
  }
}
