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
