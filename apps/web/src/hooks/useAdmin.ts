import { useQuery } from "@tanstack/react-query";
import api from "../libs/api";
import { adminKeys } from "../libs/queryKeys";

export interface AdminDashboardStats {
  total_completed: number;
  active_companies: number;
  mbti_distribution: Array<{ mbti_type: string; percentage: number }>;
  most_taken_tests: Array<{ title: string; taken_count: number }>;
}

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminKeys.dashboard.stats(),
    queryFn: async () => {
      const { data } = await api.get<AdminDashboardStats>("/admin/dashboard/stats");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export interface AdminTimelineItem {
  date: string;
  candidate: string;
  email: string;
  company: string;
  test: string;
}

export function useAdminTimeline() {
  return useQuery({
    queryKey: adminKeys.dashboard.timeline(),
    queryFn: async () => {
      const { data } = await api.get<AdminTimelineItem[]>("/admin/dashboard/timeline");
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  company_id: string | null;
  created_at: string;
}

export interface AdminCompany {
  id: string;
  name: string;
  domain: string;
  created_at: string;
}

export interface AdminTest {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export function useAdminUsers(page = 1, limit = 20) {
  return useQuery({
    queryKey: adminKeys.users(page, limit),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<AdminUser>>("/admin/users", {
        params: { page, limit },
      });
      return data;
    },
  });
}

export function useAdminCompanies(page = 1, limit = 20) {
  return useQuery({
    queryKey: adminKeys.companies(page, limit),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<AdminCompany>>("/admin/companies", {
        params: { page, limit },
      });
      return data;
    },
  });
}

export function useAdminTests(page = 1, limit = 20) {
  return useQuery({
    queryKey: adminKeys.tests(page, limit),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<AdminTest>>("/admin/tests", {
        params: { page, limit },
      });
      return data;
    },
  });
}

// ===== CANDIDATE ANALYTICS =====
export interface AdminCandidate {
  id: string;
  completed_at: string;
  status: "completed" | "in_progress" | "notStarted";
  guest_email?: string;
  guest_fullname?: string;
  users?: { id: string; email: string; full_name: string };
  tests: { title: string };
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

export function useAdminTestCandidates(testId: string, page = 1, limit = 20) {
  return useQuery({
    queryKey: adminKeys.testCandidates(testId, page, limit),
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<AdminCandidate>>(`/admin/tests/${testId}/candidates`, {
        params: { page, limit },
      });

      return {
        data: Array.isArray(res.data.data) ? res.data.data : [],
        total: res.data.total ?? 0,
        page: res.data.page ?? page,
        limit: res.data.limit ?? limit,
        total_pages: res.data.total_pages ?? 1,
      };
    },
    enabled: !!testId,
  });
}

export function useAdminCandidateResult(assessmentId: string) {
  return useQuery({
    queryKey: adminKeys.candidateResult(assessmentId),
    queryFn: async () => {
      const { data } = await api.get(`/admin/candidates/${assessmentId}/result`);
      return data;
    },
    enabled: !!assessmentId,
  });
}

// ===== PACKAGES =====
export interface AdminPackage {
  id: string;
  name: string;
  code: string;
  max_assignments: number;
  price_per_month: number;
  description?: string;
  benefits?: string[];
  is_active: boolean;
  created_at: string;
}
export interface CompanyAnalytics {
  monthly_assignments: { month: string; count: number }[];
  test_preferences: { test_title: string; count: number }[];
}
export function useAdminPackages() {
  return useQuery({
    queryKey: adminKeys.packages(),
    queryFn: async () => {
      const { data } = await api.get<AdminPackage[]>("/admin/packages");
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });
}
export function useAdminPackage(packageId?: string) {
  return useQuery({
    queryKey: packageId ? adminKeys.packageDetail(packageId) : ["admin", "packages", "detail", "empty"],
    queryFn: async () => {
      const { data } = await api.get<AdminPackage>(`/admin/packages/${packageId}`);
      return data;
    },
    enabled: !!packageId,
  });
}

export function useCompanyAnalytics(companyId: string) {
  return useQuery({
    queryKey: ["admin", "companies", companyId, "analytics"],
    queryFn: async () => {
      const { data } = await api.get<CompanyAnalytics>(`/admin/companies/${companyId}/analytics`);
      return data;
    },
    enabled: false,
  });
}
