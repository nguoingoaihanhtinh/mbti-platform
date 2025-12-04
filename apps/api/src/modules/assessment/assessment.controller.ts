import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AssessmentService } from './assessment.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { SubmitResponseDto } from './dto/submit-response.dto';
import { CompleteAssessmentDto } from './dto/complete-assessment.dto';

@Controller('assessments')
@UseGuards(JwtAuthGuard)
export class AssessmentController {
  constructor(private assessmentService: AssessmentService) {}

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

  @Post(':id/complete')
  completeAssessment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CompleteAssessmentDto,
    @Req() req,
  ) {
    return this.assessmentService.completeAssessment(id, req.user.sub);
  }

  @Get(':id')
  getAssessment(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.assessmentService.getAssessmentById(id, req.user.sub);
  }

  @Get(':id/responses')
  getResponses(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    // Todo: verify ownership
    return this.assessmentService.getResponses(id);
  }

  @Get(':id/result')
  getResult(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.assessmentService.getResultByAssessment(id, req.user.sub);
  }
}
