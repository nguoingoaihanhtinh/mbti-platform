import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAnswerDto } from '@/modules/answer/dto/create-answer.dto';

export class CreateQuestionDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  dimension?: string;

  @IsNumber()
  order_index: number;

  @IsOptional()
  @IsString()
  test_id: string;

  @IsOptional()
  @IsString()
  test_version_id?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers?: CreateAnswerDto[];
}
