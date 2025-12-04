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
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';

@Controller('answers')
export class AnswerController {
  constructor(private answerService: AnswerService) {}

  @Post()
  createAnswer(@Body() dto: CreateAnswerDto) {
    return this.answerService.createAnswer(dto);
  }

  @Get(':id')
  getAnswer(@Param('id', ParseUUIDPipe) id: string) {
    return this.answerService.getAnswerById(id);
  }

  @Get()
  getAnswers(@Query('questionId') questionId: string) {
    return this.answerService.getAnswersByQuestion(questionId);
  }

  @Put(':id')
  updateAnswer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAnswerDto,
  ) {
    return this.answerService.updateAnswer(id, dto);
  }

  @Delete(':id')
  deleteAnswer(@Param('id', ParseUUIDPipe) id: string) {
    return this.answerService.deleteAnswer(id);
  }
}
