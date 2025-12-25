import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  BadRequestException,
  Param,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompanyService } from './company.service';
import { SubscribePackageDto } from './dto/subcribe-package.dto';
import { AssignmentDetail } from './types';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

import { ApiBody } from '@nestjs/swagger';
class CreateAssignmentDto {
  candidate_email: string;
  candidate_fullname?: string;
  test_id: string;
  note?: string;
}

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post('assignments')
  @ApiBody({
    type: CreateAssignmentDto,
    examples: {
      default: {
        summary: 'Example',
        value: {
          candidate_email: 'candidate@example.com',
          candidate_fullname: 'Candidate Name',
          test_id: 'test-uuid',
          note: 'Test for candidate',
        },
      },
    },
  })
  async createAssignment(@Req() req: any, @Body() dto: CreateAssignmentDto) {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Only company admins can assign tests');
    }

    return this.companyService.createAssignment(
      req.user.company_id,
      dto.candidate_email,
      dto.candidate_fullname || 'Guest',
      dto.test_id,
      dto.note,
    );
  }

  @Post('assignments/:id/notify')
  async notifyCandidate(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Access denied');
    }

    return this.companyService.notifyCandidate(id, req.user.company_id);
  }

  @Get('assignments')
  async getAssignments(
    @Req() req: any,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Access denied');
    }

    return this.companyService.getAssignments(req.user.company_id, page, limit);
  }

  @Get('assignments/:id')
  async getAssignment(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Access denied');
    }

    return this.companyService.getAssignment(id, req.user.company_id);
  }
  @Get('assignments/:id/detail')
  async getAssignmentDetail(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<AssignmentDetail> {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Access denied');
    }
    return this.companyService.getAssignmentDetail(id, req.user.company_id);
  }
  @Post('subscription')
  @ApiBody({
    type: SubscribePackageDto,
    examples: {
      default: {
        summary: 'Example',
        value: { package_code: 'PKG_BASIC' },
      },
    },
  })
  async subscribePackage(@Req() req: any, @Body() dto: SubscribePackageDto) {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Company access required');
    }
    await this.companyService.subscribePackage(
      req.user.company_id,
      dto.package_code,
    );
    return { success: true };
  }

  @Get('subscription')
  async getSubscription(@Req() req: any) {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Company access required');
    }
    return this.companyService.getCurrentSubscription(req.user.company_id);
  }

  @Get('dashboard/stats')
  async getDashboardStats(@Req() req: any) {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Company access required');
    }
    return this.companyService.getDashboardStats(req.user.company_id);
  }

  @Get('users')
  async getCompanyUsers(@Req() req: any) {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Access denied');
    }
    return this.companyService.getCompanyUsers(req.user.company_id);
  }
  @Get('dashboard/timeline')
  async getAssignmentTimeline(@Req() req: any) {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Company access required');
    }
    return this.companyService.getAssignmentTimeline(req.user.company_id);
  }
  @Get('profile')
  async getCompanyProfile(@Req() req: any) {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Company access required');
    }

    return this.companyService.getCompanyProfile(req.user.company_id);
  }

  @Put('profile')
  @ApiBody({
    type: UpdateCompanyProfileDto,
    examples: {
      default: {
        summary: 'Example',
        value: {
          name: 'Company ABC',
          website: 'https://company.com',
          logo_url: 'https://company.com/logo.png',
          description: 'Company description',
          address: '123 Main St',
          phone: '0123456789',
        },
      },
    },
  })
  async updateCompanyProfile(
    @Req() req: any,
    @Body() dto: UpdateCompanyProfileDto,
  ) {
    if (req.user.role !== 'company') {
      throw new BadRequestException('Company access required');
    }

    return this.companyService.updateCompanyProfile(req.user.company_id, dto);
  }
}
