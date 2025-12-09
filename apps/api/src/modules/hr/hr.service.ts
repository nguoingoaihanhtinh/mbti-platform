// hr.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
interface AssessmentWithTest {
  test_id: string;
  tests: { title: string }[];
}

interface ResultWithMbti {
  mbti_type: string;
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

    if (completionError)
      throw new BadRequestException('Failed to fetch completion stats');

    const { data: assessments, error: testError } = await this.client
      .from('assessments')
      .select('test_id, tests(title)')
      .not('completed_at', 'is', null);

    if (testError) throw new BadRequestException('Failed to fetch test stats');

    const mostTakenTests = this.groupByTestAndCount(assessments);

    const { data: results, error: mbtiError } = await this.client
      .from('results')
      .select('mbti_type');

    if (mbtiError) throw new BadRequestException('Failed to fetch MBTI stats');

    const mbtiDistribution = this.calculatePercentageDistribution(results);

    return { completionByDay, mostTakenTests, mbtiDistribution };
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
        users(id, email, full_name),
        results(mbti_type, strengths, weaknesses)
      `,
      )
      .eq('test_id', testId)
      .not('users', 'is', null)
      .range(from, to);

    if (error) throw new BadRequestException('Failed to fetch candidates');
    return data;
  }

  private groupByTestAndCount(assessments: AssessmentWithTest[]) {
    const counts = assessments.reduce(
      (acc, a) => {
        const title = a.tests[0]?.title || 'Untitled Test';
        acc[title] = (acc[title] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(counts)
      .map(([title, taken_count]) => ({ title, taken_count }))
      .sort((a, b) => b.taken_count - a.taken_count)
      .slice(0, 5);
  }

  private calculatePercentageDistribution(results: ResultWithMbti[]) {
    if (results.length === 0) return [];

    const counts = results.reduce(
      (acc, r) => {
        acc[r.mbti_type] = (acc[r.mbti_type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const total = results.length;
    return Object.entries(counts).map(([mbti_type, count]) => ({
      mbti_type,
      percentage: parseFloat(((count / total) * 100).toFixed(1)),
    }));
  }
}
