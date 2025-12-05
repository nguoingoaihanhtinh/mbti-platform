export interface Assessment {
  id: string;
  test_id: string;
  user_id: string;
  status: "draft" | "completed" | "in_progress";
  started_at: string;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedAssessments {
  data: Assessment[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
export interface Result {
  id: string;
  assessment_id: string;
  mbti_type: string;
  raw_scores?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
export interface Response {
  id: string;
  assessment_id: string;
  question_id: string;
  answer_id: string | null;
  selected_option_index: number | null;
  free_text: string | null;
  created_at: string;
}
