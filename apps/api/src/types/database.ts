export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '13.0.5';
  };
  public: {
    Tables: {
      users: {
        Row: {
          avatar: string | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          password: string;
          role: string;
          updated_at: string | null;
          id: string;
        };
        Insert: {
          avatar?: string | null;
          created_at: string | null;
          email: string;
          full_name: string | null;
          password: string;
          role: string;
          updated_at: string | null;
          id: string;
        };
        Update: {
          avatar?: string | null;
          created_at?: string | null;
          email?: string;
          full_name?: string | null;
          password?: string;
          role?: string;
          updated_at?: string | null;
          id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      role: 'candidate' | 'company' | 'admin';
      status: 'Active' | 'Inactive' | 'Banned';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// --- Helper Types  ---
type PublicSchema = Database['public'];

type TablesTypes = PublicSchema['Tables'];
type EnumsTypes = PublicSchema['Enums'];

export type TableNames = keyof TablesTypes;
export type EnumNames = keyof EnumsTypes;

// ✅ Tables
export type Tables<T extends TableNames> = TablesTypes[T]['Row'];

// ✅ TablesInsert
export type TablesInsert<T extends TableNames> = TablesTypes[T]['Insert'];

// ✅ TablesUpdate
export type TablesUpdate<T extends TableNames> = TablesTypes[T]['Update'];

// ✅ Enums
export type Enums<T extends EnumNames> = EnumsTypes[T];
