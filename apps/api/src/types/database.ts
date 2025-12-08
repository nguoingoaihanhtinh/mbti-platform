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

      otps: {
        Row: {
          email: string;
          otp: string;
          expires_at: string;
          purpose: string;
        };
        Insert: {
          email: string;
          otp: string;
          expires_at: string;
          purpose: string;
        };
        Update: {
          email?: string;
          otp?: string;
          expires_at?: string;
          purpose?: string;
        };
        Relationships: [];
      };
      assessments: {
        Row: {
          id: string;
          user_id: string;
          test_id: string;
          test_version_id: string | null;
          status: string; // 'notStarted' | 'started' | 'completed'
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          test_id: string;
          test_version_id?: string | null;
          status: string;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          test_id?: string;
          test_version_id?: string | null;
          status?: string;
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'assessments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'assessments_test_id_fkey';
            columns: ['test_id'];
            isOneToOne: false;
            referencedRelation: 'tests';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'assessments_test_version_id_fkey';
            columns: ['test_version_id'];
            isOneToOne: false;
            referencedRelation: 'test_versions';
            referencedColumns: ['id'];
          },
        ];
      };

      responses: {
        Row: {
          id: string;
          assessment_id: string;
          question_id: string;
          answer_id: string | null;
          selected_option_index: number | null;
          free_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assessment_id: string;
          question_id: string;
          answer_id?: string | null;
          selected_option_index?: number | null;
          free_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          assessment_id?: string;
          question_id?: string;
          answer_id?: string | null;
          selected_option_index?: number | null;
          free_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'responses_assessment_id_fkey';
            columns: ['assessment_id'];
            isOneToOne: false;
            referencedRelation: 'assessments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'responses_question_id_fkey';
            columns: ['question_id'];
            isOneToOne: false;
            referencedRelation: 'questions';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'responses_answer_id_fkey';
            columns: ['answer_id'];
            isOneToOne: false;
            referencedRelation: 'answers';
            referencedColumns: ['id'];
          },
        ];
      };

      // ✅ RESULTS
      results: {
        Row: {
          id: string;
          assessment_id: string;
          mbti_type: string; // CHECK: matches "^[IE][NS][FT][JP]$"
          raw_scores: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assessment_id: string;
          mbti_type: string;
          raw_scores: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          assessment_id?: string;
          mbti_type?: string;
          raw_scores?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'results_assessment_id_fkey';
            columns: ['assessment_id'];
            isOneToOne: false;
            referencedRelation: 'assessments';
            referencedColumns: ['id'];
          },
        ];
      };
      mbti_types: {
        Row: {
          id: string;
          type_code: string;
          type_name: string;
          overview: string;
          strengths: string[];
          weaknesses: string[];
          career_recommendations: string[];
          improvement_areas: string[];
          workplace_needs: string[];
          suitable_roles: string[];
          communication_style: string | null;
          leadership_style: string | null;
          stress_responses: string | null;
          development_tips: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type_code: string;
          type_name: string;
          overview: string;
          strengths: string[];
          weaknesses: string[];
          career_recommendations: string[];
          improvement_areas: string[];
          workplace_needs: string[];
          suitable_roles: string[];
          communication_style?: string | null;
          leadership_style?: string | null;
          stress_responses?: string | null;
          development_tips?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type_code?: string;
          type_name?: string;
          overview?: string;
          strengths?: string[];
          weaknesses?: string[];
          career_recommendations?: string[];
          improvement_areas?: string[];
          workplace_needs?: string[];
          suitable_roles?: string[];
          communication_style?: string | null;
          leadership_style?: string | null;
          stress_responses?: string | null;
          development_tips?: string | null;
          created_at?: string;
          updated_at?: string;
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
