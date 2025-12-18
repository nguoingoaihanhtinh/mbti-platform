// src/modules/company/types.ts
export interface AssignmentDetail {
  assessment: {
    id: string;
    status: string;
    completed_at: string | null;
    guest_email: string;
    guest_fullname: string;
    test_id: string;
    tests: { title: string }[];
    results: {
      mbti_type_id: string;
      mbti_types: {
        type_code: string;
        type_name: string;
        strengths: string[];
        weaknesses: string[];
        career_recommendations: string[];
      }[];
    }[];
  };
  responses: {
    id: string;
    assessment_id: string;
    question_id: string;
    answer_id: string | null;
    free_text: string | null;
    created_at: string;
  }[];
  test: {
    id: string;
    title: string;
    questions: {
      id: string;
      text: string;
      dimension: string | null;
      answers: { id: string; text: string }[];
    }[];
  } | null;
}
