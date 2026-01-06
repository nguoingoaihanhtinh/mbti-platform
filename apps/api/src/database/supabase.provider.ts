// src/database/supabase.provider.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Database } from '@/types/database';

@Injectable()
export class SupabaseProvider {
  public readonly client: SupabaseClient<Database>;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !serviceRoleKey) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }

    this.client = createClient<Database>(url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
}
