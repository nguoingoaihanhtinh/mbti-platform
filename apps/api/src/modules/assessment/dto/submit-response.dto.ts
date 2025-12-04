import { IsString, IsOptional, IsNumber } from 'class-validator';

export class SubmitResponseDto {
  @IsString()
  question_id: string;

  @IsOptional()
  @IsString()
  answer_id?: string;

  @IsOptional()
  @IsNumber()
  selected_option_index?: number;

  @IsOptional()
  @IsString()
  free_text?: string;
}
