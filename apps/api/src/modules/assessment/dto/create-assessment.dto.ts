import { IsString, IsIn } from 'class-validator';

export class CreateAssessmentDto {
  @IsString()
  test_id: string;

  @IsString()
  test_version_id: string;

  @IsIn(['notStarted', 'started', 'completed'])
  status: 'notStarted' | 'started' | 'completed';
}
