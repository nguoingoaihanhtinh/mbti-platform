import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreatePackageDto } from './dto/create-package.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // === PACKAGE MANAGEMENT ===
  @Post('packages')
  async createPackage(@Req() req: any, @Body() dto: CreatePackageDto) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.createPackage(dto);
  }

  @Get('packages')
  async getPackages(@Req() req: any) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.getPackages();
  }

  // === DASHBOARD ANALYTICS ===
  @Get('dashboard/stats')
  async getAdminDashboardStats(@Req() req: any) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.getAdminDashboardStats();
  }

  @Get('dashboard/timeline')
  async getTestTimeline(@Req() req: any) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.getTestTimeline(); // toàn hệ thống, không filter theo company
  }

  // === LISTS ===
  @Get('users')
  async getUsers(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.getUsers(+page, +limit);
  }

  @Get('companies')
  async getCompanies(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.getCompanies(+page, +limit);
  }

  @Get('tests')
  async getTests(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.getTests(+page, +limit);
  }

  // === CANDIDATE & TEST ANALYTICS ===
  @Get('tests/:testId/candidates')
  async getCandidatesByTest(
    @Req() req: any,
    @Param('testId') testId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.getCandidatesByTest(testId, +page, +limit);
  }

  @Get('candidates/:assessmentId/result')
  async getCandidateResult(
    @Req() req: any,
    @Param('assessmentId') assessmentId: string,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.getCandidateResult(assessmentId);
  }
}
