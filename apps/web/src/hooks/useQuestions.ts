import { useQuery } from "@tanstack/react-query";
import { questionKeys } from "../libs/queryKeys";
import api from "../libs/api";

export function useQuestions(testId: string, versionId: string | undefined, page = 1, limit = 1) {
  return useQuery({
    queryKey: questionKeys.byTest(testId, versionId, page, limit),
    queryFn: async () => {
      const res = await api.get("/questions", {
        params: { testId, versionId, page, limit },
      });
      return res.data;
    },
    enabled: !!testId,
  });
}
