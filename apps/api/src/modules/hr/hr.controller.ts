import { Controller, Get, UseGuards, Req, Param, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { UnauthorizedException } from '@nestjs/common';
import { HRService } from './hr.service';

@Controller('hr')
@UseGuards(JwtAuthGuard)
export class HRController {
  constructor(private hrService: HRService) {}

  @Get('dashboard/stats')
  async getDashboardStats(@Req() req: any) {
    console.log('HRController.getDashboardStats - user:', req.user);
    if (req.user.role !== 'company') {
      throw new UnauthorizedException(
        'Only company admins can access HR dashboard',
      );
    }

    return this.hrService.getDashboardStats();
  }

  @Get('tests/:testId/candidates')
  async getCandidatesByTest(
    @Req() req: any,
    @Param('testId') testId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    if (req.user.role !== 'company') {
      throw new UnauthorizedException('Access denied');
    }

    return this.hrService.getCandidatesByTest(testId, +page, +limit);
  }
}
