import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

interface AssessmentWithTest {
  test_id: string;
  tests: { title: string };
}

@Injectable()
export class HRService {
  private client: SupabaseClient;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
    this.client = createClient(url, key);
  }

  async getDashboardStats() {
    const { data: completionByDay, error: completionError } = await this.client
      .from('assessments')
      .select('completed_at')
      .not('completed_at', 'is', null)
      .gte(
        'completed_at',
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      )
      .order('completed_at', { ascending: true });
    // console.log(
    //   'HRService.getDashboardStats - completionByDay:',
    //   completionByDay,
    // );
    if (completionError)
      throw new BadRequestException('Failed to fetch completion stats');

    const { data: assessments, error: testError } = await this.client
      .from('assessments')
      .select('test_id, tests(title)')
      .not('completed_at', 'is', null);
    // console.log(
    //   'HRService.getDashboardStats - assessments with tests:',
    //   assessments,
    // );
    if (testError) throw new BadRequestException('Failed to fetch test stats');

    const mostTakenTests = this.groupByTestAndCount(assessments);
    const { mbtiDistribution } = await this.getMbtiDistribution();

    return { completionByDay, mostTakenTests, mbtiDistribution };
  }

  async getMbtiDistribution() {
    const { data: results, error: mbtiErr } = await this.client.from('results')
      .select(`
        mbti_types!results_mbti_type_id_fkey(
          type_code
        )
      `);
    // console.log(
    //   'HRService.getMbtiDistribution - results with mbti types:',
    //   results,
    // );
    if (mbtiErr) throw new BadRequestException('Failed to fetch MBTI stats');

    const mbtiCounts = results.reduce(
      (acc, r) => {
        const type = r.mbti_types?.[0]?.type_code;
        if (type) acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    // console.log('HRService.getMbtiDistribution - mbtiCounts:', mbtiCounts);

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

  async getTestTimeline(companyId: string) {
    const { data, error } = await this.client
      .from('assessments')
      .select(
        `
      completed_at,
      users!inner(full_name, email),
      test:tests!inner(company_id)
    `,
      )
      .not('completed_at', 'is', null)
      .gte(
        'completed_at',
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      )
      .order('completed_at', { ascending: false });

    if (error) throw new BadRequestException('Failed to fetch timeline');

    const filtered = (data || []).filter((a) => {
      const test = a.test as unknown as { company_id: string } | null;
      return test?.company_id === companyId;
    });

    return filtered.map((a) => {
      const users = a.users as unknown as {
        full_name: string;
        email: string;
      } | null;
      return {
        date: a.completed_at,
        candidate: users?.full_name || 'Anonymous',
        email: users?.email || null,
      };
    });
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
        )
      `,
      )
      .eq('test_id', testId)
      .not('completed_at', 'is', null)
      .range(from, to);
    // console.log('HRService.getCandidatesByTest - candidates data:', data);
    if (error) throw new BadRequestException('Failed to fetch candidates');
    return data;
  }

  async getCandidateResult(assessmentId: string, companyId: string) {
    const { data, error } = await this.client
      .from('assessments')
      .select(
        `
      id,
      completed_at,
      users!inner(full_name, email),
      test:tests!inner(company_id),
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

    if (error?.code === 'PGRST116') {
      throw new BadRequestException('Assessment not found');
    }
    if (error) throw error;
    if (!data) throw new BadRequestException('Assessment not found');

    const test = data.test as unknown as { company_id: string } | null;
    if (test?.company_id !== companyId) {
      throw new BadRequestException('Access denied');
    }

    return data;
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
