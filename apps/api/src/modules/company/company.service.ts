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

  async createAssignment(
    companyId: string,
    candidateEmail: string,
    testId: string,
    note?: string,
  ) {
    const { data: test } = await this.client
      .from('tests')
      .select('id')
      .eq('id', testId)
      .eq('company_id', companyId)
      .single();

    if (!test) {
      throw new BadRequestException('Test not owned by your company');
    }

    const { data: candidate } = await this.client
      .from('users')
      .select('id')
      .eq('email', candidateEmail)
      .single();

    let userId = candidate?.id;
    if (!userId) {
      const hashed = await bcrypt.hash('temporary-password-123', 10);
      const { data: newUser } = await this.client
        .from('users')
        .insert({
          email: candidateEmail,
          full_name: candidateEmail.split('@')[0],
          password: hashed,
          role: 'candidate',
          company_id: companyId,
        })
        .select('id')
        .single();
      userId = newUser?.id;
    }

    const { data: assessment } = await this.client
      .from('assessments')
      .insert({
        user_id: userId!,
        test_id: testId,
        status: 'assigned',
      })
      .select('id')
      .single();

    const assessmentId = assessment!.id;
    const testLink = `https://mbti-platform-web.vercel.app/test?testId=${testId}&assessmentId=${assessmentId}`;
    await sendAssignmentEmail(candidateEmail, testLink, note);

    return { success: true, assessment_id: assessmentId };
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
        
        completed_at,
        users(email, full_name),
        tests(title)
      `,
      )
      .eq('tests.company_id', companyId)
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
        users(email, full_name),
        tests(title),
        test_id,
        results(
          mbti_type_id,
          mbti_types(type_code, type_name, strengths, weaknesses, career_recommendations)
        )
      `,
      )
      .eq('id', assessmentId)
      .eq('tests.company_id', companyId)

      .single();
  }

  async notifyCandidate(assessmentId: string, companyId: string) {
    const { data: assessment } = await this.getAssignment(
      assessmentId,
      companyId,
    );
    if (!assessment) throw new BadRequestException('Assignment not found');

    const testId = assessment.tests?.[0]?.title ? assessment.test_id : null;
    const candidateEmail = assessment.users?.[0]?.email;

    if (!testId || !candidateEmail) {
      throw new BadRequestException('Assignment data incomplete');
    }

    const testLink = `https://mbti-platform-web.vercel.app/test?testId=${testId}&assessmentId=${assessmentId}`;
    await sendAssignmentEmail(candidateEmail, testLink);

    return { success: true };
  }
}
