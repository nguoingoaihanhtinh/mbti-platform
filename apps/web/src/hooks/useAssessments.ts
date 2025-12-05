import { useQuery } from "@tanstack/react-query";
import { assessmentKeys } from "../libs/queryKeys";
import api from "../libs/api";
import type { PaginatedAssessments } from "../types/assessment";

export const useAssessments = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: assessmentKeys.mine(page, limit),
    queryFn: async () => {
      const response = await api.get("/assessments/me", {
        params: { page, limit },
      });
      return response.data as PaginatedAssessments;
    },
    // Optional: only fetch if user is authenticated
    // enabled: useAuthStore.getState().isAuthenticated,
  });
};
