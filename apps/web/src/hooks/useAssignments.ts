// src/hooks/useAssignments.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../libs/api";

// Query keys
export const assignmentKeys = {
  all: ["assignments"] as const,
  list: (page?: number, limit?: number, status?: string) =>
    [...assignmentKeys.all, "list", page, limit, status] as const,
  detail: (id: string) => [...assignmentKeys.all, "detail", id] as const,
  byTest: (testId: string) => [...assignmentKeys.all, "test", testId] as const,
};

// Types
export interface Assignment {
  id: string;
  test_id: string;
  user_id: string;
  status: "assigned" | "in_progress" | "completed";
  created_at: string;
  completed_at?: string;
  test?: {
    id: string;
    title: string;
    description?: string;
  };
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
  result?: {
    id: string;
    mbti_type: string;
    created_at: string;
  };
}

export interface CreateAssignmentData {
  test_id: string;
  user_email: string;
  user_name?: string;
}

export interface AssignmentsListResponse {
  data: Assignment[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Hooks
export function useAssignments(page: number = 1, limit: number = 10, status?: string) {
  return useQuery({
    queryKey: assignmentKeys.list(page, limit, status),
    queryFn: async () => {
      const { data } = await api.get<AssignmentsListResponse>("/hr/assignments", {
        params: { page, limit, status },
      });
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useAssignmentDetail(assessmentId: string) {
  return useQuery({
    queryKey: assignmentKeys.detail(assessmentId),
    queryFn: async () => {
      const { data } = await api.get<Assignment>(`/hr/assignments/${assessmentId}`);
      return data;
    },
    enabled: !!assessmentId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAssignmentData) => {
      const response = await api.post("/hr/assignments", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate assignments list to refetch
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
    },
  });
}

export function useAvailableTests() {
  return useQuery({
    queryKey: ["tests", "available"],
    queryFn: async () => {
      const { data } = await api.get("/tests");
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
