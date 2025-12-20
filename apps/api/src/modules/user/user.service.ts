import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private client: SupabaseClient;

  constructor(private config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    }
    this.client = createClient(url, key);
  }
  async createCompany(companyName: string) {
    const { data, error } = await this.client
      .from('companies')
      .insert({ name: companyName })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }
  async create(userData: {
    email: string;
    password: string;
    full_name: string;
    role: string;
    company_id?: string; // ← THÊM
  }) {
    const insertData = {
      email: userData.email,
      password: userData.password,
      full_name: userData.full_name,
      role: userData.role,
      company_id: userData.company_id, // ← THÊM
    };

    const { data, error } = await this.client
      .from('users')
      .insert([insertData])
      .select('id, email, full_name, role, company_id, created_at')
      .single();

    if (error?.message.includes('duplicate')) {
      throw new BadRequestException('Email already exists');
    }
    if (error) throw error;
    return data;
  }

  async findOneByEmail(email: string) {
    const { data, error } = await this.client
      .from('users')
      .select('id, email, full_name, role, company_id, created_at, password')
      .eq('email', email)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  }

  async findOneById(id: string) {
    const { data, error } = await this.client
      .from('users')
      .select('id, email, full_name, role, created_at')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error?.code === 'PGRST116')
      throw new NotFoundException('User not found');
    if (error) throw error;
    return data;
  }

  async findAll(page?: number, limit?: number, email?: string) {
    let query = this.client
      .from('users')
      .select('id, email, full_name, role, created_at', { count: 'exact' })
      .is('deleted_at', null);

    if (email) {
      query = query.ilike('email', `%${email}%`);
    }

    if (page !== undefined && limit !== undefined) {
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      const { data, error, count } = await query.range(from, to);
      if (error && error.code === 'PGRST116') {
        return {
          data: [],
          total: 0,
          page: page || 1,
          limit: limit || 10,
          total_pages: 0,
        };
      }
      if (error) throw error;
      return {
        data: data || [],
        total: count || 0,
        page,
        limit,
        total_pages: count ? Math.ceil(count / limit) : 0,
      };
    } else {
      const { data, error, count } = await query;
      if (error) throw error;
      return {
        data: data || [],
        total: count || 0,
        page: 1,
        limit: count || 0,
        total_pages: 1,
      };
    }
  }

  async updatePassword(email: string, hashedPassword: string) {
    const { error } = await this.client
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', email)
      .single();

    if (error) throw error;
  }
  async updateProfile(
    id: string,
    updateData: { full_name?: string; email?: string },
  ) {
    if (!updateData.full_name && !updateData.email) {
      throw new BadRequestException(
        'At least one field (full_name or email) must be provided',
      );
    }

    if (updateData.email) {
      const existing = await this.client
        .from('users')
        .select('id')
        .eq('email', updateData.email)
        .neq('id', id)
        .single();

      if (existing.data) {
        throw new BadRequestException('Email already in use');
      }
    }

    const { data, error } = await this.client
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, full_name, role, created_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Failed to update profile');
    }

    return data;
  }
  async getUserProfile(userId: string) {
    const { data, error } = await this.client
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  }

  async updateUserProfile(
    userId: string,
    profileData: {
      education?: string;
      experience?: string;
      social_links?: Record<string, string>;
      about?: string;
    },
  ) {
    const { data, error } = await this.client
      .from('user_profiles')
      .upsert({
        id: userId,
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }
  async softDelete(id: string) {
    const { error } = await this.client
      .from('users')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error?.code === 'PGRST116') {
      throw new NotFoundException('User not found');
    }
    if (error) throw error;
    return { success: true };
  }
}
