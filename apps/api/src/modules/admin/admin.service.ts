import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreatePackageDto } from './dto/create-package.dto';
import { PaginationService } from '@/common/services/pagination.service';
import { UpdatePackageDto } from './dto/update-package.dto';

@Injectable()
export class AdminService {
  private client: SupabaseClient;

  constructor(
    private config: ConfigService,
    private pagination: PaginationService,
  ) {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
    this.client = createClient(url, key);
  }

  // === PACKAGE MANAGEMENT ===
  async createPackage(dto: CreatePackageDto) {
    const { data, error } = await this.client
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
    const { data, error } = await this.client
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
  async getPackageById(id: string) {
    const { data, error } = await this.client
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

    const { data, error } = await this.client
      .from('packages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  async deletePackage(id: string) {
    const { data: existing, error: findErr } = await this.client
      .from('packages')
      .select('id')
      .eq('id', id)
      .single();

    if (findErr || !existing) {
      throw new BadRequestException('Package không tồn tại');
    }

    const { error } = await this.client.from('packages').delete().eq('id', id);

    if (error) throw error;

    return { success: true };
  }

  async getAdminDashboardStats() {
    const { count: totalCompleted, error: compErr } = await this.client
      .from('assessments')
      .select('id', { count: 'exact' })
      .not('completed_at', 'is', null);
    if (compErr) throw compErr;

    const { count: activeCompanies, error: compErr2 } = await this.client
      .from('companies')
      .select('id', { count: 'exact' });
    if (compErr2) throw compErr2;

    const { mbtiDistribution } = await this.getMbtiDistribution();

    const { data: assessments, error: assessErr } = await this.client
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
    const { data, error } = await this.client
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

      const candidateName = user?.full_name || a.guest_fullname || 'Anonymous';
      const email = user?.email || a.guest_email || null;
      const companyName = company?.name || 'N/A';
      const testName = test?.title || 'N/A';

      return {
        date: a.completed_at,
        candidate: candidateName,
        email,
        company: companyName,
        test: testName,
      };
    });
  }

  async getUsers(page: number = 1, limit: number = 20) {
    return this.pagination.paginate(
      () =>
        this.client
          .from('users')
          .select('*')
          .order('created_at', { ascending: false }),
      page,
      limit,
    );
  }

  async getCompanies(page: number = 1, limit: number = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: companies, error: compErr } = await this.client
      .from('companies')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (compErr) throw compErr;

    const companyIds = companies.map((c) => c.id);

    let subMap = new Map();
    if (companyIds.length > 0) {
      const { data: subs, error: subErr } = await this.client
        .from('company_subscriptions')
        .select(
          `
        company_id,
        id,
        package_id,   
        used_assignments,
        created_at,
        updated_at,
        carry_over_assignments,
        packages(
          id,
          name,
          code,
          is_active,
          max_assignments,
          price_per_month
        )
      `,
        )
        .in('company_id', companyIds);

      if (subErr) throw subErr;
      console.log('Raw subs:', subs);
      subs.forEach((sub) => {
        subMap.set(sub.company_id, sub);
      });
    }

    let assignmentsMap = new Map<string, number>();
    let candidatesMap = new Map<string, number>();
    if (companyIds.length > 0) {
      const { data: allAssessments, error: assessErr } = await this.client
        .from('assessments')
        .select('company_id, completed_at')
        .in('company_id', companyIds);

      if (assessErr) throw assessErr;

      allAssessments.forEach((assessment) => {
        const companyId = assessment.company_id;
        assignmentsMap.set(companyId, (assignmentsMap.get(companyId) || 0) + 1);
        if (assessment.completed_at) {
          candidatesMap.set(companyId, (candidatesMap.get(companyId) || 0) + 1);
        }
      });
    }

    const enrichedCompanies = companies.map((company) => {
      const sub = subMap.get(company.id);
      const pkg = sub?.packages;

      return {
        id: company.id,
        name: company.name,
        created_at: company.created_at,
        subscription:
          sub && pkg
            ? {
                package_name: pkg.name,
                package_code: pkg.code,
                end_date:
                  sub.end_date ||
                  new Date(
                    new Date(sub.start_date || sub.created_at).getTime() +
                      30 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                status: sub.status || 'active',
                used_assignments: sub.used_assignments,
                max_assignments: pkg.max_assignments,
                carry_over: sub.carry_over_assignments || 0,
              }
            : null,
        stats: {
          total_assignments: assignmentsMap.get(company.id) || 0,
          total_candidates: candidatesMap.get(company.id) || 0,
        },
      };
    });

    const { count: total } = await this.client
      .from('companies')
      .select('id', { count: 'exact' });

    return {
      enrichedCompanies,
      total: total || 0,
      page,
      limit,
      total_pages: total ? Math.ceil(total / limit) : 0,
    };
  }
  async getCompanyAnalytics(companyId: string) {
    const { data: assignments, error } = await this.client
      .from('assessments')
      .select('created_at, tests(title)')
      .eq('company_id', companyId);

    if (error) throw error;
    if (!assignments || assignments.length === 0) {
      return { monthly_assignments: [], test_preferences: [] };
    }

    const monthlyMap = new Map<string, number>();
    assignments.forEach((a) => {
      const month = new Date(a.created_at).toISOString().slice(0, 7);
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + 1);
    });

    const monthly_assignments = Array.from(monthlyMap.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    const testMap = new Map<string, number>();
    assignments.forEach((a) => {
      const test = Array.isArray(a.tests) ? a.tests[0] : a.tests;
      const title = test?.title || 'Untitled Test';
      testMap.set(title, (testMap.get(title) || 0) + 1);
    });

    const test_preferences = Array.from(testMap.entries())
      .map(([test_title, count]) => ({ test_title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return { monthly_assignments, test_preferences };
  }

  async getTests(page: number = 1, limit: number = 20) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: tests, error: testErr } = await this.client
      .from('tests')
      .select('id, title, description, is_active, created_at')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (testErr) throw testErr;

    const testIds = tests.map((t) => t.id);

    let questionCountMap = new Map<string, number>();
    if (testIds.length > 0) {
      for (const testId of testIds) {
        const { count } = await this.client
          .from('questions')
          .select('id', { count: 'exact' })
          .eq('test_id', testId);
        questionCountMap.set(testId, count || 0);
      }
    }

    let takenCountMap = new Map<string, number>();
    if (testIds.length > 0) {
      for (const testId of testIds) {
        const { count } = await this.client
          .from('assessments')
          .select('id', { count: 'exact' })
          .eq('test_id', testId);
        takenCountMap.set(testId, count || 0);
      }
    }

    const enrichedTests = tests.map((test) => ({
      ...test,
      total_questions: questionCountMap.get(test.id) || 0,
      total_assessments: takenCountMap.get(test.id) || 0,
    }));

    const { count: total } = await this.client
      .from('tests')
      .select('id', { count: 'exact' });

    return {
      data: enrichedTests,
      total: total || 0,
      page,
      limit,
      total_pages: total ? Math.ceil(total / limit) : 0,
    };
  }

  async getCandidatesByTest(
    testId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return this.pagination.paginate(
      () =>
        this.client
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
    const { data, error } = await this.client
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
    const { data: results, error: mbtiErr } = await this.client.from('results')
      .select(`
        mbti_types!results_mbti_type_id_fkey(
          type_code
        )
      `);

    if (mbtiErr) throw mbtiErr;

    const mbtiCounts = results.reduce(
      (acc, r) => {
        const type = r.mbti_types?.[0]?.type_code;
        if (type) acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = results.length;
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
    const counts = assessments.reduce(
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
    const { data: assessment, error: assessErr } = await this.client
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

    if (assessErr) throw assessErr;

    const { data: responses } = await this.client
      .from('responses')
      .select('*')
      .eq('assessment_id', assessmentId);

    const { data: test } = await this.client
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
      .eq('id', assessment.test_id)
      .single();

    const { data: resultData } = await this.client
      .from('results')
      .select(
        `
      id,
      mbti_type,
      created_at,
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
      .eq('assessment_id', assessmentId);
    const result = resultData?.[0] || null;
    return {
      assessment,
      responses: responses || [],
      test,
      result,
    };
  }
}
