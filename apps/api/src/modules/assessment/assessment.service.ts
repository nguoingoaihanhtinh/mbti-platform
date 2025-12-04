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
} from '@/types/common';

@Injectable()
export class AssessmentService {
  constructor(private supabase: SupabaseProvider) {}

  async createAssessment(
    userId: string,
    assessmentData: Omit<AssessmentInsert, 'user_id'>,
  ) {
    const { data: assessment, error } = await this.supabase.client
      .from('assessments')
      .insert({ ...assessmentData, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    if (!assessment) throw new Error('Failed to create assessment');
    return assessment;
  }

  async getAssessmentById(assessmentId: string, userId: string) {
    const { data: assessment, error } = await this.supabase.client
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .single();

    if (error || !assessment)
      throw new BadRequestException('Assessment not found');
    return assessment;
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
    if (!response) throw new Error('Failed to submit response');
    return response;
  }

  async getResponses(assessmentId: string) {
    const { data: responses, error } = await this.supabase.client
      .from('responses')
      .select('*')
      .eq('assessment_id', assessmentId);

    if (error) throw error;
    return responses;
  }

  async completeAssessment(assessmentId: string, userId: string) {
    // 1. Mark assessment as completed
    const { data: updated, error: updateErr } = await this.supabase.client
      .from('assessments')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateErr || !updated) {
      throw new BadRequestException('Failed to complete assessment');
    }

    // 2. Fetch all responses
    const { data: responses, error: resErr } = await this.supabase.client
      .from('responses')
      .select('answer_id')
      .eq('assessment_id', assessmentId);

    if (resErr) throw resErr;

    const validResponses = responses.filter(
      (r): r is { answer_id: string } => r.answer_id !== null,
    );

    // 3. Calculate MBTI type
    const mbtiType = this.calculateMBTI(validResponses);
    // 4. Save result
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
    if (!result) throw new Error('Failed to save result');

    return { assessment: updated, result };
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

  async getResultByAssessment(assessmentId: string, userId: string) {
    const { data: assessment, error: aErr } = await this.supabase.client
      .from('assessments')
      .select('id')
      .eq('id', assessmentId)
      .eq('user_id', userId)
      .single();

    if (aErr || !assessment)
      throw new BadRequestException('Assessment not found');

    const { data: result, error: rErr } = await this.supabase.client
      .from('results')
      .select('*')
      .eq('assessment_id', assessmentId)
      .single();

    if (rErr || !result) throw new BadRequestException('Result not found');
    return result;
  }
}
