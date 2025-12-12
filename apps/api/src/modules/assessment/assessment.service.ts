import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseProvider } from '@/database/supabase.provider';
import {
  AssessmentInsert,
  AssessmentUpdate,
  ResponseInsert,
  ResultInsert,
  Assessment,
  Response,
  Result,
  ResultWithMBTI,
} from '@/types/common';
import { PaginationService } from '@/common/services/pagination.service';
import { CreateAssessmentGuestDto } from './dto/create-assessment-guest.dto';

@Injectable()
export class AssessmentService {
  constructor(
    private supabase: SupabaseProvider,
    private pagination: PaginationService,
  ) {}

  async createAssessmentGuest(dto: CreateAssessmentGuestDto) {
    const { test_id, test_version_id, status, email, fullname } = dto;

    //  prevent status = 'completed' on creation
    if (status === 'completed') {
      throw new BadRequestException(
        'Cannot create assessment with status "completed"',
      );
    }

    const { data: assessment, error } = await this.supabase.client
      .from('assessments')
      .insert({
        test_id,
        test_version_id,
        status,
        guest_email: email,
        guest_fullname: fullname,
      })
      .select()
      .single();

    if (error) throw error;
    return assessment;
  }

  async completeAssessmentGuest(assessmentId: string, email: string) {
    if (!email) throw new BadRequestException('Email required');

    const { data: assessment, error } = await this.supabase.client
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .eq('guest_email', email)
      .single();

    if (error || !assessment)
      throw new BadRequestException('Assessment not found for guest');

    const { data: updated, error: updateErr } = await this.supabase.client
      .from('assessments')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', assessmentId)
      .eq('guest_email', email)
      .select()
      .single();

    if (updateErr || !updated)
      throw new BadRequestException('Failed to complete guest assessment');

    const result = await this.calculateAndSaveResult(assessmentId);

    return { assessment: updated, result };
  }

  async createAssessment(
    userId: string,
    assessmentData: Omit<AssessmentInsert, 'user_id'>,
  ) {
    const { status } = assessmentData;
    if (status === 'completed') {
      throw new BadRequestException(
        'Cannot create assessment with status "completed"',
      );
    }

    const { data: assessment, error } = await this.supabase.client
      .from('assessments')
      .insert({ ...assessmentData, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return assessment;
  }

  async getAssessmentById(
    assessmentId: string,
    userId: string,
    companyId?: string,
  ) {
    if (companyId) {
      const { data: viaCompany } = await this.supabase.client
        .from('assessments')
        .select('*, test:tests(company_id)')
        .eq('id', assessmentId)
        .eq('test.company_id', companyId)
        .single();

      if (viaCompany) {
        const { test, ...clean } = viaCompany;
        return clean;
      }
    }

    const { data: viaUser } = await this.supabase.client
      .from('assessments')
      .select('*, test:tests(company_id)')
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .single();

    if (viaUser) {
      const { test, ...clean } = viaUser;
      return clean;
    }

    throw new BadRequestException('Assessment not found');
  }

  async submitResponse(
    assessmentId: string,
    responseData: Omit<ResponseInsert, 'assessment_id'>,
  ) {
    const { data: response, error } = await this.supabase.client
      .from('responses')
      .insert({ ...responseData, assessment_id: assessmentId })
      .select()
      .single();

    if (error) throw error;
    return response;
  }

  async getResponses(
    assessmentId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return this.pagination.paginate<Response>(
      (page, limit) => {
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        return this.supabase.client
          .from('responses')
          .select('*', { count: 'exact' })
          .eq('assessment_id', assessmentId)
          .order('created_at')
          .range(from, to);
      },
      page,
      limit,
    );
  }

  async completeAssessment(assessmentId: string, userId: string) {
    const { data: updated, error: updateErr } = await this.supabase.client
      .from('assessments')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateErr || !updated) {
      throw new BadRequestException('Failed to complete assessment');
    }

    const result = await this.calculateAndSaveResult(assessmentId);

    return { assessment: updated, result };
  }

  private async calculateAndSaveResult(assessmentId: string) {
    const { data: responses, error: resErr } = await this.supabase.client
      .from('responses')
      .select('answer_id')
      .eq('assessment_id', assessmentId);

    if (resErr) throw resErr;

    const validResponses = (responses ?? []).filter(
      (r): r is { answer_id: string } => r.answer_id !== null,
    );

    const mbtiType = this.calculateMBTI(validResponses);

    const { data: result, error: resultErr } = await this.supabase.client
      .from('results')
      .insert({
        assessment_id: assessmentId,
        mbti_type: mbtiType,
        raw_scores: {}, // TODO: store actual scores
      })
      .select()
      .single();

    if (resultErr) throw resultErr;
    return result;
  }

  private calculateMBTI(responses: { answer_id: string }[]): string {
    const types = [
      'ISTJ',
      'ISFJ',
      'INFJ',
      'INTJ',
      'ISTP',
      'ISFP',
      'INFP',
      'INTP',
      'ESTP',
      'ESFP',
      'ENFP',
      'ENTP',
      'ESTJ',
      'ESFJ',
      'ENFJ',
      'ENTJ',
    ];
    return types[Math.floor(Math.random() * types.length)];
  }

  async getResultByAssessment(
    assessmentId: string,
    userId: string,
    companyId?: string,
  ): Promise<ResultWithMBTI> {
    const query = this.supabase.client
      .from('assessments')
      .select('id, test_id')
      .eq('id', assessmentId);

    if (companyId) {
      query.or(`user_id.eq.${userId},test.company_id.eq.${companyId}`);
    } else {
      query.eq('user_id', userId);
    }

    const { data: assessment } = await query.single();
    if (!assessment) throw new BadRequestException('Assessment not found');

    const { data: result } = await this.supabase.client
      .from('results')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single();

    if (!result) throw new BadRequestException('Result not found');

    const { data: mbtiType } = await this.supabase.client
      .from('mbti_types')
      .select('*')
      .eq('type_code', result.mbti_type)
      .single();

    return {
      ...result,
      mbti_type_details: mbtiType || undefined,
    };
  }

  async getUserAssessments(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    return this.pagination.paginate<Assessment>(
      (page, limit) => {
        return this.supabase.client
          .from('assessments')
          .select('*', { count: 'exact' })
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
      },
      page,
      limit,
    );
  }

  async getGuestResult(assessmentId: string, email: string) {
    // First verify this email owns the assessment
    const { data: assessment, error: assessmentErr } =
      await this.supabase.client
        .from('assessments')
        .select('id')
        .eq('id', assessmentId)
        .eq('guest_email', email)
        .single();

    if (assessmentErr || !assessment) {
      throw new BadRequestException('Assessment not found for guest');
    }

    // Then fetch the result
    const { data: result, error: resultErr } = await this.supabase.client
      .from('results')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single();

    if (resultErr || !result) {
      throw new BadRequestException('Result not found');
    }

    const { data: mbtiType, error: mbtiErr } = await this.supabase.client
      .from('mbti_types')
      .select('*')
      .eq('type_code', result.mbti_type)
      .single();

    return {
      ...result,
      mbti_type_details: mbtiType || undefined,
    };
  }
}
