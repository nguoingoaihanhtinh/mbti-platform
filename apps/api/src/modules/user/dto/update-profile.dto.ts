export class UpdateProfileDto {
  full_name?: string;
  email?: string;
  education?: string;
  experience?: string;
  social_links?: Record<string, string>;
  about?: string;
}
