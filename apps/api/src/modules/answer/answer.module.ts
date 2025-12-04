import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { SupabaseProvider } from '@/database/supabase.provider';
import { PaginationModule } from '@/common/module/pagination.module';

@Module({
  imports: [PaginationModule],
  controllers: [AnswerController],
  providers: [AnswerService, SupabaseProvider],
})
export class AnswerModule {}
