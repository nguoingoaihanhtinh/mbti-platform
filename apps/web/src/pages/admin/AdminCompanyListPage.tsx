import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../libs/api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Building2,
  Mail,
  Calendar,
  Package,
  Users,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import CompanyAnalyticsDropdown from "../../components/CompanyAnalyticsDropdown";
import { useDynamicTranslation } from "../../libs/translations";
interface Company {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  subscription?: {
    package_name: string;
    package_code: string;
    end_date: string;
    status: string;
  };
  stats?: {
    total_assignments: number;
    total_candidates: number;
  };
}

interface CompaniesResponse {
  enrichedCompanies: Company[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export default function AdminCompaniesPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [openAnalyticsId, setOpenAnalyticsId] = useState<string | null>(null);
  const { tContent } = useDynamicTranslation();
  const toggleAnalytics = (id: string) => {
    setOpenAnalyticsId(openAnalyticsId === id ? null : id);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "companies", page, limit],
    queryFn: async () => {
      const res = await api.get<CompaniesResponse>("/admin/companies", {
        params: { page, limit },
      });
      return res.data;
    },
  });

  const companies = data?.enrichedCompanies || [];
  const total = data?.total || 0;
  const totalPages = data?.total_pages || 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{tContent("Loading companies list...")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tContent("Manage Companies")}</h1>
          <p className="text-gray-500 mt-1">{tContent("Total companies").replace("{count}", String(total))}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
              <p className="text-sm text-gray-500">{tContent("Total companies")}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {companies.filter((c) => c.subscription?.status === "active").length || 0}
              </p>
              <p className="text-sm text-gray-500">{tContent("Active")}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {companies.reduce((acc, c) => acc + (c.stats?.total_assignments || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">{tContent("Total assignments")}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {companies.reduce((acc, c) => acc + (c.stats?.total_candidates || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">{tContent("Total candidates")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={tContent("Search by name or email...")}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Company")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Email")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  {tContent("Current Package")}
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Assignments")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Candidates")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Created Date")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Analytics")}</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => {
                const isOpen = openAnalyticsId === company.id;
                return (
                  <>
                    <tr
                      key={company.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isOpen ? "bg-purple-50" : ""}`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{company.full_name}</p>
                            <p className="text-xs text-gray-400">{company.id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{company.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {company.subscription ? (
                          <div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                company.subscription.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {company.subscription.package_name}
                            </span>
                            <p className="text-xs text-gray-400 mt-1">
                              {tContent("Until")} {new Date(company.subscription.end_date).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">{tContent("No subscription")}</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-900">
                          {company.stats?.total_assignments || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-sm font-medium text-gray-900">
                          {company.stats?.total_candidates || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(company.created_at).toLocaleDateString("vi-VN")}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => toggleAnalytics(company.id)}
                          className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                        >
                          {isOpen ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              {tContent("Hide Analytics")}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              {tContent("View Analytics")}
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    {/* Analytics Row - Hiển thị ngay dưới company được chọn */}
                    {isOpen && (
                      <tr key={`${company.id}-analytics`}>
                        <td colSpan={7} className="p-0">
                          <CompanyAnalyticsDropdown companyId={company.id} isOpen={true} />
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {tContent("Showing")} {(page - 1) * limit + 1} - {Math.min(page * limit, total)} {tContent("of")} {total}{" "}
            {tContent("results")}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              {tContent("Page")} {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
