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
import { TestService } from './test.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { UpdateTestVersionDto } from './dto/update-test-version.dto';

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

  @Post()
  createTest(@Body() dto: CreateTestDto) {
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

  @Post(':testId/versions')
  createVersion(
    @Param('testId', ParseUUIDPipe) testId: string,
    @Body() dto: { version_number: number; description?: string },
  ) {
    return this.testService.createTestVersion(testId, dto);
  }

  @Get(':testId/versions/:versionId/full')
  getFullVersion(
    @Param('testId', ParseUUIDPipe) testId: string,
    @Param('versionId', ParseUUIDPipe) versionId: string,
  ) {
    return this.testService.getTestWithContent(testId, versionId);
  }

  // ✅ UPDATE TEST
  @Put(':id')
  updateTest(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTestDto,
  ) {
    return this.testService.updateTest(id, dto);
  }

  // ✅ UPDATE TEST VERSION
  @Put('versions/:versionId')
  updateTestVersion(
    @Param('versionId', ParseUUIDPipe) versionId: string,
    @Body() dto: UpdateTestVersionDto,
  ) {
    return this.testService.updateTestVersion(versionId, dto);
  }

  // ✅ DELETE TEST
  @Delete(':id')
  deleteTest(@Param('id', ParseUUIDPipe) id: string) {
    return this.testService.deleteTest(id);
  }

  // ✅ DELETE TEST VERSION
  @Delete('versions/:versionId')
  deleteTestVersion(@Param('versionId', ParseUUIDPipe) versionId: string) {
    return this.testService.deleteTestVersion(versionId);
  }
}
