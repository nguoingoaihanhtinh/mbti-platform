import { useQuery } from "@tanstack/react-query";
import api from "../libs/api";
import { hrKeys } from "../libs/queryKeys";

export interface DashboardStats {
  completionByDay: Array<{
    completed_at: string;
  }>;
  mostTakenTests: Array<{
    title: string;
    taken_count: number;
  }>;
  mbtiDistribution: Array<{
    type_code: string;
    count: number;
  }>;
}

export interface TimelineItem {
  date: string;
  candidate: string;
  email: string;
}

export interface TestCandidate {
  id: string;
  completed_at: string;
  status: "completed" | "in_progress" | "not_started";
  users: {
    id: string;
    email: string;
    full_name: string;
  };
  results?: Array<{
    mbti_types: {
      type_code: string;
      type_name: string;
      overview: string;
      strengths: string[];
      weaknesses: string[];
      leadership_style: string;
      communication_style: string;
      career_recommendations: string[];
    } | null;
  }>;
}

export interface TestCandidatesResponse {
  candidates: TestCandidate[];
  total: number;
  page: number;
  limit: number;
}

export function useHRStats() {
  return useQuery({
    queryKey: hrKeys.stats(),
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>("/hr/dashboard/stats");
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useHRTimeline() {
  return useQuery({
    queryKey: hrKeys.timeline(),
    queryFn: async () => {
      const { data } = await api.get<TimelineItem[]>("/hr/dashboard/timeline");
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTestCandidates(testId: string, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: hrKeys.testCandidates(testId, page, limit),
    queryFn: async () => {
      const { data } = await api.get<TestCandidate[]>(`/hr/tests/${testId}/candidates`, {
        params: { page, limit },
      });

      return {
        candidates: data,
        total: data.length,
        page,
        limit,
      } as TestCandidatesResponse;
    },
    enabled: !!testId,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
}

export function useCandidateResult(assessmentId: string) {
  return useQuery({
    queryKey: hrKeys.candidateResult(assessmentId),
    queryFn: async () => {
      const { data } = await api.get(`/hr/candidates/${assessmentId}/result`);
      return data;
    },
    enabled: !!assessmentId,
    staleTime: 5 * 60 * 1000,
  });
}

export function processCompletionData(completionByDay: Array<{ completed_at: string }>) {
  const grouped = completionByDay.reduce(
    (acc, item) => {
      const date = new Date(item.completed_at).toLocaleDateString("vi-VN");
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(grouped)
    .map(([date, count]) => ({
      date,
      completions: count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function processTimelineData(timeline: TimelineItem[]) {
  const grouped = timeline.reduce(
    (acc, item) => {
      const date = new Date(item.date).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });

      if (!acc[date]) {
        acc[date] = {
          date,
          candidates: new Set<string>(),
          tests: 0,
        };
      }

      acc[date].candidates.add(item.email);
      acc[date].tests += 1;

      return acc;
    },
    {} as Record<string, { date: string; candidates: Set<string>; tests: number }>
  );

  return Object.values(grouped)
    .map((item) => ({
      date: item.date,
      candidates: item.candidates.size,
      tests: item.tests,
    }))
    .sort((a, b) => {
      const [dayA, monthA] = a.date.split("/").map(Number);
      const [dayB, monthB] = b.date.split("/").map(Number);
      return monthA !== monthB ? monthA - monthB : dayA - dayB;
    });
}
