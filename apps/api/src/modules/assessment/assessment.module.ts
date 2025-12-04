import { Module } from '@nestjs/common';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { SupabaseProvider } from '@/database/supabase.provider';

@Module({
  controllers: [AssessmentController],
  providers: [AssessmentService, SupabaseProvider],
})
export class AssessmentModule {}
