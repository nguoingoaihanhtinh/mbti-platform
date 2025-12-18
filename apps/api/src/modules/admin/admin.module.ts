import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PaginationModule } from '@/common/module/pagination.module';
import { PackagesController } from '../package/package.controller';

@Module({
  imports: [AuthModule, PaginationModule],
  controllers: [AdminController, PackagesController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
