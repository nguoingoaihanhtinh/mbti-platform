// src/modules/admin/admin.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { PaginationService } from '@/common/services/pagination.service';
import { SupabaseProvider } from '@/database/supabase.provider';

@Injectable()
export class AdminService {
  constructor(
    private supabase: SupabaseProvider,
    private pagination: PaginationService,
  ) {}

  // === PACKAGE MANAGEMENT ===
  async createPackage(dto: CreatePackageDto) {
    const { data, error } = await this.supabase.client
      .from('packages')
      .insert({
        name: dto.name,
        code: dto.code,
        max_assignments: dto.max_assignments,
        price_per_month: dto.price_per_month,
        description: dto.description || null,
        benefits: dto.benefits || [],
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getPackages() {
    const { data, error } = await this.supabase.client
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getPackageById(id: string) {
    const { data, error } = await this.supabase.client
      .from('packages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updatePackage(id: string, dto: UpdatePackageDto) {
    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.max_assignments !== undefined)
      updateData.max_assignments = dto.max_assignments;
    if (dto.price_per_month !== undefined)
      updateData.price_per_month = dto.price_per_month;
    if (dto.description !== undefined)
      updateData.description = dto.description || null;
    if (dto.is_active !== undefined) updateData.is_active = dto.is_active;
    if (dto.benefits !== undefined) updateData.benefits = dto.benefits || [];

    const { data, error } = await this.supabase.client
      .from('packages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deletePackage(id: string) {
    const { data: existing, error: findErr } = await this.supabase.client
      .from('packages')
      .select('id')
      .eq('id', id)
      .single();

    if (findErr || !existing) {
      throw new BadRequestException('Package không tồn tại');
    }

    const { error } = await this.supabase.client
      .from('packages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  }

  // === DASHBOARD & ANALYTICS ===
  async getAdminDashboardStats() {
    // Dùng 1 query nếu có thể, nhưng ở đây hợp lý khi tách
    const [{ count: totalCompleted }, { count: activeCompanies }] =
      await Promise.all([
        this.supabase.client
          .from('assessments')
          .select('id', { count: 'exact' })
          .not('completed_at', 'is', null),
        this.supabase.client.from('companies').select('id', { count: 'exact' }),
      ]);

    const { mbtiDistribution } = await this.getMbtiDistribution();

    const { data: assessments, error: assessErr } = await this.supabase.client
      .from('assessments')
      .select('test_id, tests(title)')
      .not('completed_at', 'is', null);
    if (assessErr) throw assessErr;

    const mostTakenTests = this.groupByTestAndCount(assessments || []);

    return {
      total_completed: totalCompleted || 0,
      active_companies: activeCompanies || 0,
      mbti_distribution: mbtiDistribution,
      most_taken_tests: mostTakenTests,
    };
  }

  async getTestTimeline() {
    const { data, error } = await this.supabase.client
      .from('assessments')
      .select(
        `
        completed_at,
        user:users(full_name, email),
        guest_email,
        guest_fullname,
        test:tests(title),
        company:companies(name)
      `,
      )
      .not('completed_at', 'is', null)
      .gte(
        'completed_at',
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      )
      .order('completed_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((a) => {
      const user = Array.isArray(a.user) ? a.user[0] : a.user;
      const company = Array.isArray(a.company) ? a.company[0] : a.company;
      const test = Array.isArray(a.test) ? a.test[0] : a.test;

      return {
        date: a.completed_at,
        candidate: user?.full_name || a.guest_fullname || 'Anonymous',
        email: user?.email || a.guest_email || null,
        company: company?.name || 'N/A',
        test: test?.title || 'N/A',
      };
    });
  }

  async getUsers(page = 1, limit = 20) {
    return this.pagination.paginate(
      () =>
        this.supabase.client
          .from('users')
          .select('*')
          .order('created_at', { ascending: false }),
      page,
      limit,
    );
  }

  // ✅ TỐI ƯU: getCompanies — loại bỏ N+1, dùng aggregate
  async getCompanies(page = 1, limit = 20) {
    return this.pagination.paginate(
      () =>
        this.supabase.client
          .from('companies')
          .select(
            `
            *,
            subscription:company_subscriptions!company_id(*, packages(*)),
            assessment_stats:assessments(count)
          `,
          )
          .order('created_at', { ascending: false }),
      page,
      limit,
    );
  }

  async getCompanyAnalytics(companyId: string) {
    const { data, error } = await this.supabase.client
      .from('assessments')
      .select(
        `
        created_at,
        tests(title),
        completed_at
      `,
      )
      .eq('company_id', companyId);

    if (error) throw error;
    if (!data || data.length === 0) {
      return { monthly_assignments: [], test_preferences: [] };
    }

    const monthlyMap = new Map<string, number>();
    const testMap = new Map<string, number>();

    data.forEach((a) => {
      // Monthly assignments
      const month = (a.created_at || new Date().toISOString()).slice(0, 7);
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);

      // Test preferences
      const title = a.tests?.title || 'Untitled Test';
      testMap.set(title, (testMap.get(title) || 0) + 1);
    });

    const monthly_assignments = Array.from(monthlyMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const test_preferences = Array.from(testMap.entries())
      .map(([test_title, count]) => ({ test_title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { monthly_assignments, test_preferences };
  }

  // ✅ TỐI ƯU: getTests — loại bỏ loop N+1, dùng aggregate
  async getTests(page = 1, limit = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error } = await this.supabase.client
      .from('tests')
      .select(
        `
        *,
        question_count:questions(count),
        assessment_count:assessments(count)
      `,
      )
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    const enriched = (data || []).map((test) => ({
      ...test,
      total_questions: test.question_count?.[0]?.count || 0,
      total_assessments: test.assessment_count?.[0]?.count || 0,
    }));

    const { count } = await this.supabase.client
      .from('tests')
      .select('*', { count: 'exact', head: true });

    return {
      data: enriched,
      total: count || 0,
      page,
      limit,
      total_pages: count ? Math.ceil(count / limit) : 0,
    };
  }

  async getCandidatesByTest(testId: string, page = 1, limit = 20) {
    return this.pagination.paginate(
      () =>
        this.supabase.client
          .from('assessments')
          .select(
            `
            id,
            completed_at,
            status,
            users!inner(id, email, full_name),
            results!inner(
              mbti_types!results_mbti_type_id_fkey(
                type_code,
                type_name,
                overview,
                strengths,
                weaknesses,
                career_recommendations,
                communication_style,
                leadership_style
              )
            ),
            tests!inner(title)
          `,
            { count: 'exact' },
          )
          .eq('test_id', testId)
          .not('completed_at', 'is', null),
      page,
      limit,
    );
  }

  async getCandidateResult(assessmentId: string) {
    const { data, error } = await this.supabase.client
      .from('assessments')
      .select(
        `
        id,
        completed_at,
        users!inner(full_name, email),
        tests!inner(title),
        results!inner(
          mbti_types!results_mbti_type_id_fkey(
            type_code,
            type_name,
            overview,
            strengths,
            weaknesses,
            career_recommendations,
            communication_style,
            leadership_style
          )
        )
      `,
      )
      .eq('id', assessmentId)
      .single();

    if (error) throw error;
    if (!data) throw new BadRequestException('Assessment not found');
    return data;
  }

  // === UTILS ===
  private async getMbtiDistribution() {
    const { data, error } = await this.supabase.client.from('results').select(`
        mbti_types!inner(type_code)
      `);

    if (error) throw error;

    const mbtiCounts = data.reduce(
      (acc, r) => {
        const type = r.mbti_types?.type_code;
        if (type) acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = data.length;
    const mbtiDistribution = Object.entries(mbtiCounts).map(
      ([type, count]) => ({
        mbti_type: type,
        percentage:
          total > 0 ? parseFloat(((count / total) * 100).toFixed(1)) : 0,
      }),
    );

    return { mbtiDistribution };
  }

  private groupByTestAndCount(assessments: any[]) {
    const counts: Record<string, number> = assessments.reduce(
      (acc, a) => {
        const title = a.tests?.title || 'Untitled Test';
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(counts)
      .map(([title, taken_count]) => ({
        title,
        taken_count: taken_count as number,
      }))
      .sort((a, b) => b.taken_count - a.taken_count)
      .slice(0, 5);
  }

  async getCandidateAssessmentDetail(assessmentId: string) {
    const assessmentRes = await this.supabase.client
      .from('assessments')
      .select(
        `
        id,
        status,
        completed_at,
        created_at,
        guest_email,
        guest_fullname,
        test_id,
        company_id,
        tests!inner(title),
        companies!left(name),
        users!left(full_name, email)
      `,
      )
      .eq('id', assessmentId)
      .single();

    if (assessmentRes.error) throw assessmentRes.error;

    const [responsesRes, testRes, resultRes] = await Promise.all([
      this.supabase.client
        .from('responses')
        .select('*')
        .eq('assessment_id', assessmentId),
      this.supabase.client
        .from('tests')
        .select(
          `
          id,
          title,
          questions!inner(
            id,
            text,
            dimension,
            answers!inner(id, text)
          )
        `,
        )
        .eq('id', assessmentRes.data.test_id)
        .single(),
      this.supabase.client
        .from('results')
        .select(
          `
          *,
          mbti_types!inner(
            type_code,
            type_name,
            overview,
            strengths,
            weaknesses,
            career_recommendations,
            communication_style,
            leadership_style
          )
        `,
        )
        .eq('assessment_id', assessmentId),
    ]);

    return {
      assessment: assessmentRes.data,
      responses: responsesRes.data || [],
      test: testRes.data,
      result: resultRes.data?.[0] || null,
    };
  }
}
