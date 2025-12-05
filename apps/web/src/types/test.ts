export interface Test {
  id: string;
  title: string;
  description: string;
  version_id: string;
  created_at: string;
}

export interface Answer {
  id: string;
  question_id: string;
  text: string;
  order_index: number;
}

export interface Question {
  id: string;
  test_id: string;
  test_version_id: string;
  text: string;
  order_index: number;
  type: string;
  dimension?: string | null;
  answers: Answer[];
}
