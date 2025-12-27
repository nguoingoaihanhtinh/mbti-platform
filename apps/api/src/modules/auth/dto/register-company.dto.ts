// src/modules/auth/dto/register-company.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterCompanyDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  full_name: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  company_name: string;
}
