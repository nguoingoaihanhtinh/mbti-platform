import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAnswerDto {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsString()
  dimension?: string;

  @IsOptional()
  @IsNumber()
  order_index?: number;
}
