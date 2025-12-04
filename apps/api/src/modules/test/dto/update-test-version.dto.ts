import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTestVersionDto {
  @IsOptional()
  @IsNumber()
  version_number?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
