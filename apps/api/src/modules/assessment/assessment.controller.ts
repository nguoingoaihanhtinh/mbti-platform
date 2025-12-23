import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Req,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { SubmitResponseDto } from './dto/submit-response.dto';
import { CompleteAssessmentDto } from './dto/complete-assessment.dto';

import { CreateAssessmentGuestDto } from './dto/create-assessment-guest.dto';
import { CompleteAssessmentGuestDto } from './dto/complete-assessment-guest.dto';

@Controller('assessments')
export class AssessmentController {
  constructor(private assessmentService: AssessmentService) {}

  @Post('guest')
  createAssessmentGuest(@Body() dto: CreateAssessmentGuestDto) {
    throw new BadRequestException('Guest cannot create assessment directly');
  }

  @Post(':id/guest-complete')
  completeAssessmentGuest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CompleteAssessmentGuestDto,
  ) {
    return this.assessmentService.completeAssessmentGuest(id, dto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyAssessments(
    @Req() req,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 10;

    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException('Invalid page or limit');
    }

    return this.assessmentService.getUserAssessments(req.user.sub, page, limit);
  }
  @UseGuards(JwtAuthGuard)
  @Post()
  createAssessment(@Body() dto: CreateAssessmentDto, @Req() req) {
    return this.assessmentService.createAssessment(req.user.sub, dto);
  }

  @Post(':id/responses')
  submitResponse(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SubmitResponseDto,
    @Req() req,
  ) {
    // Todo: verify assessment belongs to user
    return this.assessmentService.submitResponse(id, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  completeAssessment(
    @Param('id', ParseUUIDPipe) id: string,

    @Req() req,
  ) {
    return this.assessmentService.completeAssessment(id, req.user.sub);
  }

  @Get(':id')
  getAssessment(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const userId = req.user?.sub || null;
    const companyId =
      req.user?.role === 'company' ? req.user.company_id : undefined;

    return this.assessmentService.getAssessmentById(id, userId, companyId);
  }

  @Get(':id/responses')
  getResponses(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('page') pageStr?: string,
    @Query('limit') limitStr?: string,
  ) {
    const page = pageStr ? parseInt(pageStr, 10) : 1;
    const limit = limitStr ? parseInt(limitStr, 10) : 20;

    return this.assessmentService.getResponses(id, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/result')
  getResult(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    const userId = req.user?.sub;
    const companyId =
      req.user?.role === 'company' ? req.user.company_id : undefined;

    return this.assessmentService.getResultByAssessment(id, userId, companyId);
  }

  @Get(':id/guest-result')
  async getGuestResult(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('email') email: string,
  ) {
    if (!email) {
      throw new BadRequestException('Email required');
    }

    return this.assessmentService.getGuestResult(id, email);
  }
}
