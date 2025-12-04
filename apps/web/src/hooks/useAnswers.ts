import { useQuery } from "@tanstack/react-query";
import { answerKeys } from "../libs/queryKeys";
import api from "../libs/api";

export function useAnswers(questionId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: answerKeys.byQuestion(questionId, page, limit),
    queryFn: async () => {
      const res = await api.get("/answers", {
        params: { questionId, page, limit },
      });
      return res.data;
    },
    enabled: !!questionId,
  });
}
