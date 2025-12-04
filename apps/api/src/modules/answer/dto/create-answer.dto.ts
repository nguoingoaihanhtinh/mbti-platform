import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  text: string;

  @IsNumber()
  score: number;

  @IsOptional()
  @IsString()
  dimension?: string;

  @IsNumber()
  order_index: number;

  @IsString()
  question_id: string;
}
