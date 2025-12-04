import { Module } from '@nestjs/common';
import { AssessmentController } from './assessment.controller';
import { AssessmentService } from './assessment.service';
import { SupabaseProvider } from '@/database/supabase.provider';
import { PaginationModule } from '@/common/module/pagination.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PaginationModule, AuthModule],
  controllers: [AssessmentController],
  providers: [AssessmentService, SupabaseProvider],
})
export class AssessmentModule {}
