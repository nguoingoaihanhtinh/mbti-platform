import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseProvider } from '@/database/supabase.provider';
import { QuestionInsert, QuestionUpdate, Question } from '@/types/common';

@Injectable()
export class QuestionService {
  constructor(private supabase: SupabaseProvider) {}

  async createQuestion(data: QuestionInsert) {
    const { data: question, error } = await this.supabase.client
      .from('questions')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    if (!question) throw new Error('Failed to create question');
    return question;
  }

  async getQuestionById(id: string): Promise<Question> {
    const { data: question, error } = await this.supabase.client
      .from('questions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !question) throw new BadRequestException('Question not found');
    return question;
  }

  async getQuestionsByTest(testId: string, versionId?: string) {
    let query = this.supabase.client
      .from('questions')
      .select('*')
      .eq('test_id', testId);

    if (versionId) {
      query = query.eq('test_version_id', versionId);
    }

    const { data: questions, error } = await query.order('order_index');
    if (error) throw error;
    return questions;
  }

  async updateQuestion(id: string, data: QuestionUpdate): Promise<Question> {
    const { data: updated, error } = await this.supabase.client
      .from('questions')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!updated) throw new BadRequestException('Question not found');
    return updated;
  }

  async deleteQuestion(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('questions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
