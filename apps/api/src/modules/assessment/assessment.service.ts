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
    const testId = assessment.test_id;
    const { data: updated, error: updateErr } = await this.supabase.client
      .from('assessments')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        test_id: testId,
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
    userId: string | null,
    companyId?: string,
  ) {
    if (companyId) {
      const { data: viaCompany } = await this.supabase.client
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .eq('company_id', companyId)
        .single();
      if (viaCompany) return viaCompany;
    }
    if (userId) {
      const { data: viaUser } = await this.supabase.client
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .eq('user_id', userId)
        .single();
      if (viaUser) return viaUser;
    }
    const { data: assessment, error } = await this.supabase.client
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();
    if (error || !assessment) {
      throw new BadRequestException('Assessment not found');
    }
    return assessment;
  }

  async submitResponse(
    assessmentId: string,
    responseData: Omit<ResponseInsert, 'assessment_id'>,
  ) {
    const { question_id, answer_id } = responseData;
    const { data: existing } = await this.supabase.client
      .from('responses')
      .select('id')
      .eq('assessment_id', assessmentId)
      .eq('question_id', question_id)
      .single();
    if (existing) {
      const { data: updated, error: updateErr } = await this.supabase.client
        .from('responses')
        .update({ answer_id })
        .eq('id', existing.id)
        .select()
        .single();
      if (updateErr) throw updateErr;
      return updated;
    }
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
      () =>
        this.supabase.client
          .from('responses')
          .select('*')
          .eq('assessment_id', assessmentId)
          .order('created_at'),
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
      .select('answer_id, questions(dimension)')
      .eq('assessment_id', assessmentId);
    if (resErr) throw resErr;
    if (!responses || responses.length === 0) {
      throw new BadRequestException('No responses found for assessment');
    }
    const validResponses = responses
      .filter(
        (
          r,
        ): r is {
          answer_id: string;
          questions: { dimension: string | null };
        } => r.answer_id !== null,
      )
      .map((r) => ({ answer_id: r.answer_id }));
    if (validResponses.length === 0) {
      throw new BadRequestException('No valid responses to calculate MBTI');
    }
    const mbtiType = this.calculateMBTI(validResponses);

    const { data: mbtiRecord, error: mbtiErr } = await this.supabase.client
      .from('mbti_types')
      .select('id')
      .eq('type_code', mbtiType)
      .single();

    if (mbtiErr || !mbtiRecord) {
      console.warn(`MBTI type ${mbtiType} not found in mbti_types table`);
    }

    const { data: result, error: resultErr } = await this.supabase.client
      .from('results')
      .insert({
        assessment_id: assessmentId,
        mbti_type: mbtiType,
        mbti_type_id: mbtiRecord?.id || null,
        raw_scores: {},
      })
      .select()
      .single();
    if (resultErr) {
      throw new BadRequestException(
        `Failed to save result: ${resultErr.message}`,
      );
    }
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
    await this.getAssessmentById(assessmentId, userId, companyId);
    const { data: result } = await this.supabase.client
      .from('results')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single();
    if (!result) throw new BadRequestException('Result not found');
    if (!result.mbti_type) {
      throw new BadRequestException('MBTI type is missing in result');
    }
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
      () =>
        this.supabase.client
          .from('assessments')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
      page,
      limit,
    );
  }

  async getGuestResult(assessmentId: string, email: string) {
    const { data: assessment, error: assessmentErr } =
      await this.supabase.client
        .from('assessments')
        .select('test_id')
        .eq('id', assessmentId)
        .eq('guest_email', email)
        .single();
    if (assessmentErr || !assessment) {
      throw new BadRequestException('Assessment not found for guest');
    }
    const { data: result, error: resultErr } = await this.supabase.client
      .from('results')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single();
    if (resultErr || !result) {
      throw new BadRequestException('Result not found');
    }
    if (!result.mbti_type) {
      throw new BadRequestException('MBTI type is missing in result');
    }
    const { data: mbtiType, error: mbtiErr } = await this.supabase.client
      .from('mbti_types')
      .select('*')
      .eq('type_code', result.mbti_type)
      .single();
    return {
      ...result,
      test_id: assessment.test_id,
      mbti_type_details: mbtiType || undefined,
    };
  }

  async deleteAssessment(assessmentId: string, userId: string) {
    const { data: assessment } = await this.supabase.client
      .from('assessments')
      .select('id')
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .single();
    if (!assessment) {
      throw new BadRequestException('Assessment not found or access denied');
    }
    await this.supabase.client
      .from('responses')
      .delete()
      .eq('assessment_id', assessmentId);
    await this.supabase.client
      .from('results')
      .delete()
      .eq('assessment_id', assessmentId);
    const { error } = await this.supabase.client
      .from('assessments')
      .delete()
      .eq('id', assessmentId)
      .eq('user_id', userId);
    if (error) throw error;
  }
}
