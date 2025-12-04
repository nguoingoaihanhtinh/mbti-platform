import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuestionDto } from '@/modules/quesion/dto/create-question.dto';

export class CreateTestVersionDto {
  @IsNumber()
  version_number: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateTestDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ValidateNested()
  @Type(() => CreateTestVersionDto)
  version: CreateTestVersionDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
