import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Controller('questions')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post()
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.questionService.createQuestion(dto);
  }

  @Get(':id')
  getQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.getQuestionById(id);
  }

  @Get()
  getQuestions(
    @Query('testId') testId: string,
    @Query('versionId') versionId?: string,
  ) {
    return this.questionService.getQuestionsByTest(testId, versionId);
  }

  @Put(':id')
  updateQuestion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuestionDto,
  ) {
    return this.questionService.updateQuestion(id, dto);
  }

  @Delete(':id')
  deleteQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.deleteQuestion(id);
  }
}
