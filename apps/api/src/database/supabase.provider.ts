import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Database } from '@/types/database';
@Injectable()
export class SupabaseProvider {
  public readonly client: SupabaseClient<Database>;

  constructor(private config: ConfigService) {
    this.client = createClient<Database>(
      this.config.get<string>('SUPABASE_URL')!,
      this.config.get<string>('SUPABASE_ANON_KEY')!,
    );
  }
}
