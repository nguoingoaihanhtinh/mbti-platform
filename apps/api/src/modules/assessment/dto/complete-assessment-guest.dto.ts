import { IsEmail } from 'class-validator';

export class CompleteAssessmentGuestDto {
  @IsEmail()
  email: string;
}
