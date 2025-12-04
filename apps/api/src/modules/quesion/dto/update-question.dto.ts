import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateQuestionDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  dimension?: string;

  @IsOptional()
  @IsNumber()
  order_index?: number;

  @IsOptional()
  @IsString()
  test_version_id?: string;
}
