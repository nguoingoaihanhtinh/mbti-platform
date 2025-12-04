import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { SupabaseProvider } from '@/database/supabase.provider';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, SupabaseProvider],
})
export class QuestionModule {}
