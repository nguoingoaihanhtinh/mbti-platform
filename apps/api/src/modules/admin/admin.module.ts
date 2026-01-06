import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PaginationModule } from '@/common/module/pagination.module';
import { PackagesController } from '../package/package.controller';
import { PdfExportModule } from '@/common/module/pdf-export.module';
import { SupabaseProvider } from '@/database/supabase.provider';

@Module({
  imports: [AuthModule, PaginationModule, PdfExportModule],
  controllers: [AdminController, PackagesController],
  providers: [AdminService, SupabaseProvider],
  exports: [AdminService],
})
export class AdminModule {}
