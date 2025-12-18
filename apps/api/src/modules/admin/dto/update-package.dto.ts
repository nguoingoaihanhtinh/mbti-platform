// src/modules/admin/dto/update-package.dto.ts
import {
  IsString,
  IsInt,
  Min,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class UpdatePackageDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  max_assignments?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  price_per_month?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
