import { Database } from '@/types/database';

// === USER ===
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

export interface UserQueryParams {
  page?: number;
  limit?: number;
  fields?: string;
  id: string;
  email?: string;
}
