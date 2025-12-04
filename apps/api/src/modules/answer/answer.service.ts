import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseProvider } from '@/database/supabase.provider';
import { AnswerInsert, AnswerUpdate, Answer } from '@/types/common';
import { PaginationService } from '@/common/services/pagination.service';

@Injectable()
export class AnswerService {
  constructor(
    private supabase: SupabaseProvider,
    private pagination: PaginationService,
  ) {}

  async createAnswer(data: AnswerInsert) {
    const { data: answer, error } = await this.supabase.client
      .from('answers')
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    if (!answer) throw new Error('Failed to create answer');
    return answer;
  }

  async getAnswerById(id: string): Promise<Answer> {
    const { data: answer, error } = await this.supabase.client
      .from('answers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !answer) throw new BadRequestException('Answer not found');
    return answer;
  }

  async getAnswersByQuestion(
    questionId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    return this.pagination.paginate<Answer>(
      (page, limit) => {
        let query = this.supabase.client
          .from('answers')
          .select('*', { count: 'exact' })
          .eq('question_id', questionId)
          .order('order_index');

        return query;
      },
      page,
      limit,
    );
  }

  async updateAnswer(id: string, data: AnswerUpdate): Promise<Answer> {
    const { data: updated, error } = await this.supabase.client
      .from('answers')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!updated) throw new BadRequestException('Answer not found');
    return updated;
  }

  async deleteAnswer(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from('answers')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
