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

// === ASSESSMENT ===
export type Assessment = Database['public']['Tables']['assessments']['Row'];
export type AssessmentInsert =
  Database['public']['Tables']['assessments']['Insert'];
export type AssessmentUpdate =
  Database['public']['Tables']['assessments']['Update'];

// === RESPONSE ===
export type Response = Database['public']['Tables']['responses']['Row'];
export type ResponseInsert =
  Database['public']['Tables']['responses']['Insert'];
export type ResponseUpdate =
  Database['public']['Tables']['responses']['Update'];

// === RESULT ===
export type Result = Database['public']['Tables']['results']['Row'];
export type ResultInsert = Database['public']['Tables']['results']['Insert'];
export type ResultUpdate = Database['public']['Tables']['results']['Update'];

export interface UserQueryParams {
  page?: number;
  limit?: number;
  fields?: string;
  id: string;
  email?: string;
}

// --- MBTI Type ---
export type MBTIType = Database['public']['Tables']['mbti_types']['Row'];

export interface ResultWithMBTI extends Result {
  mbti_type_details?: MBTIType;
}
export type Package = Database['public']['Tables']['packages']['Row'];
export type PackageInsert = Database['public']['Tables']['packages']['Insert'];
export type PackageUpdate = Database['public']['Tables']['packages']['Update'];

// === COMPANY ===
export type Company = Database['public']['Tables']['companies']['Row'];
export type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
export type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

// === COMPANY SUBSCRIPTIONS (company sử dụng) ===
export type CompanySubscription =
  Database['public']['Tables']['company_subscriptions']['Row'];
export type CompanySubscriptionInsert =
  Database['public']['Tables']['company_subscriptions']['Insert'];
export type CompanySubscriptionUpdate =
  Database['public']['Tables']['company_subscriptions']['Update'];

export interface SubscribePackageDto {
  package_code: string;
}
