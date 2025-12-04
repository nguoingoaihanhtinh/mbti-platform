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
      tests: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      test_versions: {
        Row: {
          id: string;
          test_id: string;
          version_number: number;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          test_id: string;
          version_number: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          test_id?: string;
          version_number?: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'test_versions_test_id_fkey';
            columns: ['test_id'];
            isOneToOne: false;
            referencedRelation: 'tests';
            referencedColumns: ['id'];
          },
        ];
      };
      questions: {
        Row: {
          id: string;
          test_id: string;
          test_version_id: string | null;
          text: string;
          type: string | null;
          dimension: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          test_id: string;
          test_version_id?: string | null;
          text: string;
          type?: string | null;
          dimension?: string | null;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          test_id?: string;
          test_version_id?: string | null;
          text?: string;
          type?: string | null;
          dimension?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'questions_test_id_fkey';
            columns: ['test_id'];
            isOneToOne: false;
            referencedRelation: 'tests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'questions_test_version_id_fkey';
            columns: ['test_version_id'];
            isOneToOne: false;
            referencedRelation: 'test_versions';
            referencedColumns: ['id'];
          },
        ];
      };
      answers: {
        Row: {
          id: string;
          question_id: string;
          text: string;
          score: number;
          dimension: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          text: string;
          score: number;
          dimension?: string | null;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          text?: string;
          score?: number;
          dimension?: string | null;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'answers_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
        ];
      };

      password_reset_otp: {
        Row: {
          email: string;
          otp: string;
          expires_at: string;
        };
        Insert: {
          email: string;
          otp: string;
          expires_at: string;
        };
        Update: {
          email?: string;
          otp?: string;
          expires_at?: string;
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
