import { useQuery } from "@tanstack/react-query";

import { testKeys } from "../libs/queryKeys";
import api from "../libs/api";

export function useTests(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...testKeys.all, page, limit],
    queryFn: async () => {
      const res = await api.get("/tests", { params: { page, limit } });
      return res.data;
    },
  });
}

export function useTest(id: string, versionId?: string) {
  return useQuery({
    queryKey: testKeys.details(id),
    queryFn: async () => {
      const url = versionId ? `/tests/${id}/versions/${versionId}` : `/tests/${id}`;
      const res = await api.get(url);
      return res.data;
    },
  });
}

export function useTestVersions(testId: string) {
  return useQuery({
    queryKey: testKeys.versions(testId),
    queryFn: async () => {
      const res = await api.get(`/tests/${testId}/versions`);
      return res.data;
    },
  });
}
