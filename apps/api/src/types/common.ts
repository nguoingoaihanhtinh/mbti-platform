import { Database } from '@/types/database';

// === USER ===
export type User = Database['public']['Tables']['users']['Row'];
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type UserUpdate = Database['public']['Tables']['users']['Update'];

// === TESTS ===
export type Test = Database['public']['Tables']['tests']['Row'];
export type TestInsert = Database['public']['Tables']['tests']['Insert'];
export type TestUpdate = Database['public']['Tables']['tests']['Update'];

// === TEST VERSIONS ===
export type TestVersion = Database['public']['Tables']['test_versions']['Row'];
export type TestVersionInsert =
  Database['public']['Tables']['test_versions']['Insert'];
export type TestVersionUpdate =
  Database['public']['Tables']['test_versions']['Update'];

// === QUESTIONS ===
export type Question = Database['public']['Tables']['questions']['Row'];
export type QuestionInsert =
  Database['public']['Tables']['questions']['Insert'];
export type QuestionUpdate =
  Database['public']['Tables']['questions']['Update'];

// === ANSWERS ===
export type Answer = Database['public']['Tables']['answers']['Row'];
export type AnswerInsert = Database['public']['Tables']['answers']['Insert'];
export type AnswerUpdate = Database['public']['Tables']['answers']['Update'];

export interface UserQueryParams {
  page?: number;
  limit?: number;
  fields?: string;
  id: string;
  email?: string;
}
