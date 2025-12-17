import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { sendAssignmentEmail } from '@/utils/email';

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
    const { data: pkg, error: pkgErr } = await this.client
      .from('packages')
      .select('id, max_assignments')
      .eq('code', packageCode)
      .eq('is_active', true)
      .single();

    if (pkgErr || !pkg) {
      throw new BadRequestException(
        'Gói dịch vụ không tồn tại hoặc đã ngừng cung cấp',
      );
    }

    const { error: subErr } = await this.client
      .from('company_subscriptions')
      .upsert(
        {
          company_id: companyId,
          package_id: pkg.id,
          used_assignments: 0,
        },
        { onConflict: 'company_id' },
      );

    if (subErr) throw subErr;
  }

  async getCurrentSubscription(companyId: string) {
    const { data: sub, error } = await this.client
      .from('company_subscriptions')
      .select(
        `
        *,
        packages!inner(
          id, name, code, max_assignments, price_per_month, is_active
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

    return {
      total_completed: completedCount,
      mbti_distribution: mbtiDistribution,
      quota: {
        used: subscription?.used_assignments || 0,
        max: subscription?.packages.max_assignments || 0,
        package_name: subscription?.packages.name || 'Chưa đăng ký',
      },
    };
  }

  async createAssignment(
    companyId: string,
    candidateEmail: string,
    testId: string,
    note?: string,
  ) {
    const subscription = await this.getCurrentSubscription(companyId);
    if (!subscription) {
      throw new BadRequestException('Vui lòng đăng ký gói trước khi gửi test');
    }
    if (
      subscription.used_assignments >= subscription.packages.max_assignments
    ) {
      throw new BadRequestException(
        `Đã đạt giới hạn ${subscription.packages.max_assignments} lượt gửi`,
      );
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
        guest_fullname: 'Guest',
      })
      .select()
      .single();
    if (assessErr) throw assessErr;

    // 4. Tăng quota
    await this.client
      .from('company_subscriptions')
      .update({ used_assignments: subscription.used_assignments + 1 })
      .eq('company_id', companyId);

    // 5. Gửi email
    const testLink = `https://mbti-platform-web.vercel.app/test?testId=${testId}&candidateEmail=${candidateEmail}`;
    await sendAssignmentEmail(candidateEmail, testLink, note);

    return { success: true };
  }
  async getAssignments(companyId: string, page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    return this.client
      .from('assessments')
      .select(
        `
      id,
      status,
      guest_email,
      guest_fullname,
      completed_at,
      tests(title)
    `,
      )
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .range(from, to);
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
}
