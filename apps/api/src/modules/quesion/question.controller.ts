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
import { ApiBody } from '@nestjs/swagger';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
@Controller('questions')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post()
  @ApiBody({
    type: CreateQuestionDto,
    examples: {
      default: {
        summary: 'Example',
        value: {
          text: 'Question text',
          type: 'single',
          dimension: 'EI',
          order_index: 1,
          test_id: 'test-uuid',
          test_version_id: 'version-uuid',
          answers: [
            {
              text: 'Answer 1',
              score: 1,
              dimension: 'EI',
              order_index: 0,
              question_id: 'question-uuid',
            },
          ],
        },
      },
    },
  })
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
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.questionService.getQuestionsByTest(
      testId,
      versionId,
      page,
      limit,
    );
  }

  @Put(':id')
  @ApiBody({
    type: UpdateQuestionDto,
    examples: {
      default: {
        summary: 'Example',
        value: {
          text: 'Updated question',
          type: 'multi',
          dimension: 'SN',
          order_index: 2,
          test_version_id: 'version-uuid',
        },
      },
    },
  })
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
