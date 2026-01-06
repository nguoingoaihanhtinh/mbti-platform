export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      ai_scoring_logs: {
        Row: {
          assessment_id: string;
          created_at: string | null;
          id: string;
          model: string;
          prompt: string | null;
          response: string | null;
          scores: Json | null;
          updated_at: string | null;
        };
        Insert: {
          assessment_id: string;
          created_at?: string | null;
          id?: string;
          model: string;
          prompt?: string | null;
          response?: string | null;
          scores?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          assessment_id?: string;
          created_at?: string | null;
          id?: string;
          model?: string;
          prompt?: string | null;
          response?: string | null;
          scores?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_scoring_logs_assessment_id_fkey';
            columns: ['assessment_id'];
            isOneToOne: false;
            referencedRelation: 'assessments';
            referencedColumns: ['id'];
          },
        ];
      };
      answers: {
        Row: {
          created_at: string | null;
          dimension: string | null;
          id: string;
          order_index: number;
          question_id: string;
          score: number;
          text: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          dimension?: string | null;
          id?: string;
          order_index: number;
          question_id: string;
          score: number;
          text: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          dimension?: string | null;
          id?: string;
          order_index?: number;
          question_id?: string;
          score?: number;
          text?: string;
          updated_at?: string | null;
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
      assessments: {
        Row: {
          company_id: string | null;
          completed_at: string | null;
          created_at: string | null;
          guest_email: string | null;
          guest_fullname: string | null;
          id: string;
          started_at: string | null;
          status: string | null;
          test_id: string;
          test_version_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          company_id?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          guest_email?: string | null;
          guest_fullname?: string | null;
          id?: string;
          started_at?: string | null;
          status?: string | null;
          test_id: string;
          test_version_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          company_id?: string | null;
          completed_at?: string | null;
          created_at?: string | null;
          guest_email?: string | null;
          guest_fullname?: string | null;
          id?: string;
          started_at?: string | null;
          status?: string | null;
          test_id?: string;
          test_version_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'assessments_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
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
          {
            foreignKeyName: 'assessments_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      companies: {
        Row: {
          address: string | null;
          created_at: string | null;
          description: string | null;
          domain: string | null;
          id: string;
          logo_url: string | null;
          name: string;
          phone: string | null;
          updated_at: string | null;
          website: string | null;
        };
        Insert: {
          address?: string | null;
          created_at?: string | null;
          description?: string | null;
          domain?: string | null;
          id?: string;
          logo_url?: string | null;
          name: string;
          phone?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Update: {
          address?: string | null;
          created_at?: string | null;
          description?: string | null;
          domain?: string | null;
          id?: string;
          logo_url?: string | null;
          name?: string;
          phone?: string | null;
          updated_at?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      company_subscriptions: {
        Row: {
          carry_over_assignments: number | null;
          company_id: string;
          created_at: string | null;
          end_date: string | null;
          id: string;
          package_id: string;
          start_date: string | null;
          status: string | null;
          updated_at: string | null;
          used_assignments: number;
        };
        Insert: {
          carry_over_assignments?: number | null;
          company_id: string;
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          package_id: string;
          start_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
          used_assignments?: number;
        };
        Update: {
          carry_over_assignments?: number | null;
          company_id?: string;
          created_at?: string | null;
          end_date?: string | null;
          id?: string;
          package_id?: string;
          start_date?: string | null;
          status?: string | null;
          updated_at?: string | null;
          used_assignments?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'company_subscriptions_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'company_subscriptions_package_id_fkey';
            columns: ['package_id'];
            isOneToOne: false;
            referencedRelation: 'packages';
            referencedColumns: ['id'];
          },
        ];
      };
      mbti_career_paths: {
        Row: {
          created_at: string | null;
          development_path: string | null;
          id: string;
          industry: string[];
          job_satisfaction_factors: string[];
          mbti_type_id: string | null;
          potential_challenges: string[];
          role_title: string;
          salary_range: string | null;
          skills_needed: string[];
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          development_path?: string | null;
          id?: string;
          industry: string[];
          job_satisfaction_factors: string[];
          mbti_type_id?: string | null;
          potential_challenges: string[];
          role_title: string;
          salary_range?: string | null;
          skills_needed: string[];
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          development_path?: string | null;
          id?: string;
          industry?: string[];
          job_satisfaction_factors?: string[];
          mbti_type_id?: string | null;
          potential_challenges?: string[];
          role_title?: string;
          salary_range?: string | null;
          skills_needed?: string[];
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'mbti_career_paths_mbti_type_id_fkey';
            columns: ['mbti_type_id'];
            isOneToOne: false;
            referencedRelation: 'mbti_types';
            referencedColumns: ['id'];
          },
        ];
      };
      mbti_dimension_descriptions: {
        Row: {
          created_at: string | null;
          description: string;
          dimension_code: string;
          dimension_name: string;
          high_trait: string;
          high_trait_description: string;
          id: string;
          low_trait: string;
          low_trait_description: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description: string;
          dimension_code: string;
          dimension_name: string;
          high_trait: string;
          high_trait_description: string;
          id?: string;
          low_trait: string;
          low_trait_description: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          dimension_code?: string;
          dimension_name?: string;
          high_trait?: string;
          high_trait_description?: string;
          id?: string;
          low_trait?: string;
          low_trait_description?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      mbti_types: {
        Row: {
          career_recommendations: string[];
          communication_style: string | null;
          created_at: string | null;
          development_tips: string | null;
          id: string;
          improvement_areas: string[];
          leadership_style: string | null;
          overview: string;
          strengths: string[];
          stress_responses: string | null;
          suitable_roles: string[];
          type_code: string;
          type_name: string;
          updated_at: string | null;
          weaknesses: string[];
          workplace_needs: string[];
        };
        Insert: {
          career_recommendations: string[];
          communication_style?: string | null;
          created_at?: string | null;
          development_tips?: string | null;
          id?: string;
          improvement_areas: string[];
          leadership_style?: string | null;
          overview: string;
          strengths: string[];
          stress_responses?: string | null;
          suitable_roles: string[];
          type_code: string;
          type_name: string;
          updated_at?: string | null;
          weaknesses: string[];
          workplace_needs: string[];
        };
        Update: {
          career_recommendations?: string[];
          communication_style?: string | null;
          created_at?: string | null;
          development_tips?: string | null;
          id?: string;
          improvement_areas?: string[];
          leadership_style?: string | null;
          overview?: string;
          strengths?: string[];
          stress_responses?: string | null;
          suitable_roles?: string[];
          type_code?: string;
          type_name?: string;
          updated_at?: string | null;
          weaknesses?: string[];
          workplace_needs?: string[];
        };
        Relationships: [];
      };
      otps: {
        Row: {
          email: string;
          expires_at: string;
          otp: string;
          purpose: string;
        };
        Insert: {
          email: string;
          expires_at: string;
          otp: string;
          purpose?: string;
        };
        Update: {
          email?: string;
          expires_at?: string;
          otp?: string;
          purpose?: string;
        };
        Relationships: [];
      };
      packages: {
        Row: {
          benefits: Json | null;
          code: string;
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          max_assignments: number;
          name: string;
          price_per_month: number;
          updated_at: string | null;
        };
        Insert: {
          benefits?: Json | null;
          code: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          max_assignments: number;
          name: string;
          price_per_month: number;
          updated_at?: string | null;
        };
        Update: {
          benefits?: Json | null;
          code?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          max_assignments?: number;
          name?: string;
          price_per_month?: number;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          created_at: string | null;
          dimension: string | null;
          id: string;
          order_index: number;
          test_id: string;
          test_version_id: string | null;
          text: string;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          dimension?: string | null;
          id?: string;
          order_index: number;
          test_id: string;
          test_version_id?: string | null;
          text: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          dimension?: string | null;
          id?: string;
          order_index?: number;
          test_id?: string;
          test_version_id?: string | null;
          text?: string;
          type?: string | null;
          updated_at?: string | null;
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
      responses: {
        Row: {
          answer_id: string | null;
          assessment_id: string;
          created_at: string | null;
          free_text: string | null;
          id: string;
          question_id: string;
          selected_option_index: number | null;
          updated_at: string | null;
        };
        Insert: {
          answer_id?: string | null;
          assessment_id: string;
          created_at?: string | null;
          free_text?: string | null;
          id?: string;
          question_id: string;
          selected_option_index?: number | null;
          updated_at?: string | null;
        };
        Update: {
          answer_id?: string | null;
          assessment_id?: string;
          created_at?: string | null;
          free_text?: string | null;
          id?: string;
          question_id?: string;
          selected_option_index?: number | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'responses_answer_id_fkey';
            columns: ['answer_id'];
            isOneToOne: false;
            referencedRelation: 'answers';
            referencedColumns: ['id'];
          },
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
        ];
      };
      results: {
        Row: {
          assessment_id: string;
          created_at: string | null;
          id: string;
          mbti_type: string | null;
          mbti_type_id: string | null;
          raw_scores: Json | null;
          updated_at: string | null;
        };
        Insert: {
          assessment_id: string;
          created_at?: string | null;
          id?: string;
          mbti_type?: string | null;
          mbti_type_id?: string | null;
          raw_scores?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          assessment_id?: string;
          created_at?: string | null;
          id?: string;
          mbti_type?: string | null;
          mbti_type_id?: string | null;
          raw_scores?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'results_assessment_id_fkey';
            columns: ['assessment_id'];
            isOneToOne: false;
            referencedRelation: 'assessments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'results_mbti_type_id_fkey';
            columns: ['mbti_type_id'];
            isOneToOne: false;
            referencedRelation: 'mbti_types';
            referencedColumns: ['id'];
          },
        ];
      };
      test_versions: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          test_id: string;
          updated_at: string | null;
          version_number: number;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          test_id: string;
          updated_at?: string | null;
          version_number: number;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          test_id?: string;
          updated_at?: string | null;
          version_number?: number;
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
      tests: {
        Row: {
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: boolean | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_profiles: {
        Row: {
          about: string | null;
          education: string | null;
          experience: string | null;
          id: string;
          social_links: Json | null;
          updated_at: string | null;
        };
        Insert: {
          about?: string | null;
          education?: string | null;
          experience?: string | null;
          id: string;
          social_links?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          about?: string | null;
          education?: string | null;
          experience?: string | null;
          id?: string;
          social_links?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      users: {
        Row: {
          avatar: string | null;
          company_id: string | null;
          created_at: string | null;
          deleted_at: string | null;
          email: string;
          full_name: string;
          id: string;
          last_seen_at: string | null;
          password: string | null;
          role: string;
          updated_at: string | null;
        };
        Insert: {
          avatar?: string | null;
          company_id?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          email: string;
          full_name: string;
          id?: string;
          last_seen_at?: string | null;
          password?: string | null;
          role?: string;
          updated_at?: string | null;
        };
        Update: {
          avatar?: string | null;
          company_id?: string | null;
          created_at?: string | null;
          deleted_at?: string | null;
          email?: string;
          full_name?: string;
          id?: string;
          last_seen_at?: string | null;
          password?: string | null;
          role?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'users_company_id_fkey';
            columns: ['company_id'];
            isOneToOne: false;
            referencedRelation: 'companies';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  'public'
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
