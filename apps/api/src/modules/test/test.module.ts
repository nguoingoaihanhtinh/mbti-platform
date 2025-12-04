import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { SupabaseProvider } from '@/database/supabase.provider';
import { PaginationModule } from '@/common/module/pagination.module';

@Module({
  imports: [PaginationModule],
  controllers: [TestController],
  providers: [TestService, SupabaseProvider],
})
export class TestModule {}
