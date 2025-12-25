import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Query,
  Post,
  Body,
  Put,
  Delete,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PdfExportService } from '../../common/services/pdf-export.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

import { ApiBody } from '@nestjs/swagger';
@Controller('admin')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(
    private adminService: AdminService,
    private pdfExportService: PdfExportService,
  ) {}

  @Post('packages')
  @ApiBody({
    type: CreatePackageDto,
    examples: {
      default: {
        summary: 'Example',
        value: {
          name: 'Gói cơ bản',
          code: 'PKG_BASIC',
          max_assignments: 100,
          price_per_month: 500000,
          description: 'Gói cho doanh nghiệp nhỏ',
          benefits: ['Tạo 100 assignment', 'Hỗ trợ email'],
        },
      },
    },
  })
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

  @Get('packages/:id')
  async getPackageById(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.getPackageById(id);
  }

  @Put('packages/:id')
  @ApiBody({
    type: UpdatePackageDto,
    examples: {
      default: {
        summary: 'Example',
        value: {
          name: 'Gói nâng cao',
          max_assignments: 200,
          price_per_month: 1000000,
          description: 'Gói cho doanh nghiệp lớn',
          benefits: ['Tạo 200 assignment', 'Hỗ trợ 24/7'],
          is_active: true,
        },
      },
    },
  })
  async updatePackage(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdatePackageDto,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.updatePackage(id, dto);
  }

  @Delete('packages/:id')
  async deletePackage(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.deletePackage(id);
  }

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
    return this.adminService.getTestTimeline();
  }

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

  @Get('companies/:companyId/analytics')
  async getCompanyAnalytics(
    @Req() req: any,
    @Param('companyId') companyId: string,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.getCompanyAnalytics(companyId);
  }

  // === NEW: Export Company Dashboard PDF ===
  @Get('companies/:companyId/export-pdf')
  async exportCompanyPDF(
    @Req() req: any,
    @Param('companyId') companyId: string,
    @Res() res: Response,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }

    try {
      const pdfBuffer =
        await this.pdfExportService.generateCompanyDashboardPDF(companyId);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="company-dashboard-${companyId}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (error) {
      throw new BadRequestException('Failed to generate PDF: ' + error.message);
    }
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

  @Get('candidates/:assessmentId/detail')
  async getCandidateAssessmentDetail(
    @Req() req: any,
    @Param('assessmentId') assessmentId: string,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }
    return this.adminService.getCandidateAssessmentDetail(assessmentId);
  }

  // === NEW: Export Assessment Result PDF ===
  @Get('candidates/:assessmentId/export-pdf')
  async exportAssessmentPDF(
    @Req() req: any,
    @Param('assessmentId') assessmentId: string,
    @Res() res: Response,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Admin access required');
    }

    try {
      const pdfBuffer =
        await this.pdfExportService.generateAssessmentResultPDF(assessmentId);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="assessment-result-${assessmentId}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (error) {
      throw new BadRequestException('Failed to generate PDF: ' + error.message);
    }
  }
}
