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
  Req,
  UseGuards,
} from '@nestjs/common';

import { UnauthorizedException } from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { UpdateTestVersionDto } from './dto/update-test-version.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBody } from '@nestjs/swagger';

@Controller('tests')
export class TestController {
  constructor(private testService: TestService) {}

  @Get()
  getAllTests(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.testService.getAllTests(page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({
    type: CreateTestDto,
    examples: {
      default: {
        summary: 'Example',
        value: {
          title: 'MBTI Test',
          description: 'Test description',
          is_active: true,
          version: {
            version_number: 1,
            description: 'Initial version',
          },
          questions: [
            {
              text: 'Question 1',
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
          ],
        },
      },
    },
  })
  createTest(@Req() req: any, @Body() dto: CreateTestDto) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Chỉ admin mới có thể tạo test');
    }
    return this.testService.createTest(
      {
        title: dto.title,
        description: dto.description,
        is_active: dto.is_active,
      },
      dto.version,
      dto.questions,
    );
  }

  @Get(':id')
  getTest(@Param('id', ParseUUIDPipe) id: string) {
    return this.testService.getTestWithContent(id);
  }

  @Get(':id/versions/:versionId')
  getTestVersion(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('versionId', ParseUUIDPipe) versionId: string,
  ) {
    return this.testService.getTestWithContent(id, versionId);
  }

  @Get(':testId/versions')
  getVersions(@Param('testId', ParseUUIDPipe) testId: string) {
    return this.testService.getTestVersions(testId);
  }

  @Get('versions/:versionId')
  getVersionById(@Param('versionId', ParseUUIDPipe) versionId: string) {
    return this.testService.getTestVersionById(versionId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':testId/versions')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        version_number: { type: 'number' },
        description: { type: 'string' },
      },
      required: ['version_number'],
    },
    examples: {
      default: {
        summary: 'Example',
        value: { version_number: 2, description: 'New version' },
      },
    },
  })
  createVersion(
    @Req() req: any,
    @Param('testId', ParseUUIDPipe) testId: string,
    @Body() dto: { version_number: number; description?: string },
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Chỉ admin mới có thể tạo phiên bản test',
      );
    }
    return this.testService.createTestVersion(testId, dto);
  }

  @Get(':testId/versions/:versionId/full')
  getFullVersion(
    @Param('testId', ParseUUIDPipe) testId: string,
    @Param('versionId', ParseUUIDPipe) versionId: string,
  ) {
    return this.testService.getTestWithContent(testId, versionId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  updateTest(
    @Req() req: any,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTestDto,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Chỉ admin mới có thể cập nhật test');
    }
    return this.testService.updateTest(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('versions/:versionId')
  updateTestVersion(
    @Req() req: any,
    @Param('versionId', ParseUUIDPipe) versionId: string,
    @Body() dto: UpdateTestVersionDto,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Chỉ admin mới có thể cập nhật phiên bản test',
      );
    }
    return this.testService.updateTestVersion(versionId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTest(@Req() req: any, @Param('id', ParseUUIDPipe) id: string) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Chỉ admin mới có thể xóa test');
    }
    return this.testService.deleteTest(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('versions/:versionId')
  deleteTestVersion(
    @Req() req: any,
    @Param('versionId', ParseUUIDPipe) versionId: string,
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException(
        'Chỉ admin mới có thể xóa phiên bản test',
      );
    }
    return this.testService.deleteTestVersion(versionId);
  }
}
