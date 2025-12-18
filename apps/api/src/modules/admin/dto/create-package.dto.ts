// src/modules/admin/dto/create-package.dto.ts
import { IsString, IsInt, Min, IsOptional, IsArray } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsInt()
  @Min(1)
  max_assignments: number;

  @IsInt()
  @Min(0)
  price_per_month: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];
}
