import { IsString, IsEmail, IsIn } from 'class-validator';

export class CreateAssessmentGuestDto {
  @IsString()
  test_id: string;

  @IsString()
  test_version_id: string;

  @IsString()
  @IsIn(['notStarted', 'started', 'completed'])
  status: 'notStarted' | 'started' | 'completed';

  @IsEmail()
  email: string;

  @IsString()
  fullname: string;
}
