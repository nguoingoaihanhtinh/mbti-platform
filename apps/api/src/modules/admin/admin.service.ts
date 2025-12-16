import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CreatePackageDto } from './dto/create-package.dto';

@Injectable()
export class AdminService {
  private client: SupabaseClient;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
    this.client = createClient(url, key);
  }

  async createPackage(dto: CreatePackageDto) {
    const { data, error } = await this.client
      .from('packages')
      .insert({
        name: dto.name,
        code: dto.code,
        max_assignments: dto.max_assignments,
        price_per_month: dto.price_per_month,
        description: dto.description || null,
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
        users!inner(full_name, email),
        test:tests!inner(title),
        companies!inner(name)
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
      const user = a.users as any;
      const company = a.companies as any;
      const test = a.test as any;
      return {
        date: a.completed_at,
        candidate: user?.full_name || 'Anonymous',
        email: user?.email || null,
        company: company?.name || 'N/A',
        test: test?.title || 'N/A',
      };
    });
  }

  async getUsers(page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data;
  }

  async getCompanies(page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error } = await this.client
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data;
  }

  async getTests(page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error } = await this.client
      .from('tests')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return data;
  }

  async getCandidatesByTest(testId: string, page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error } = await this.client
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
      )
      .eq('test_id', testId)
      .not('completed_at', 'is', null)
      .range(from, to);

    if (error) throw error;
    return data;
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
}
