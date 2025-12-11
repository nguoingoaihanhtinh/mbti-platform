import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @MinLength(6)
  confirm_password: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}
export class ResetPasswordDto {
  otp: string;
  newPassword: string;
}
export class VerifyRegisterOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;

  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;
}
