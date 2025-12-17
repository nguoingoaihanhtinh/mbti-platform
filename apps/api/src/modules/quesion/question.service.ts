import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseProvider } from '@/database/supabase.provider';
import { PaginationService } from '@/common/services/pagination.service';
import { QuestionInsert, QuestionUpdate, Question } from '@/types/common';

@Injectable()
export class QuestionService {
  constructor(
    private supabase: SupabaseProvider,
    private pagination: PaginationService,
  ) {}

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

  async getQuestionsByTest(
    testId: string,
    versionId?: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return this.pagination.paginate<Question>(
      () => {
        let query = this.supabase.client
          .from('questions')
          .select('*', { count: 'exact' })
          .eq('test_id', testId)
          .order('order_index');

        if (versionId) {
          query = query.eq('test_version_id', versionId);
        }

        return query;
      },
      page,
      limit,
    );
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
