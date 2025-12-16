import { IsString } from 'class-validator';

export class SubscribePackageDto {
  @IsString()
  package_code: string;
}
