// src/pages/admin/AdminTestsPage.tsx
import { useState } from "react";
import { useDynamicTranslation } from "../../libs/translations";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import api from "../../libs/api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  TestTube,
  Plus,
  Edit,
  Eye,
  Trash2,
  Calendar,
  FileText,
  Users,
} from "lucide-react";

interface Test {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  company_id?: string;
  company_name?: string;
  version?: string;
  total_questions?: number;
  total_assessments?: number;
}

interface TestsResponse {
  data: Test[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export default function AdminTestsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const { tContent } = useDynamicTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "tests", page, limit],
    queryFn: async () => {
      const { data } = await api.get<TestsResponse>("/admin/tests", {
        params: { page, limit },
      });
      return data;
    },
  });

  const handleDelete = async (testId: string) => {
    if (!confirm(tContent("Are you sure you want to delete this test?"))) return;

    try {
      await api.delete(`/tests/${testId}`);
      alert(tContent("Delete test successful!"));
      window.location.reload();
    } catch (error: any) {
      alert(error.response?.data?.message || tContent("An error occurred"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{tContent("Loading tests list...")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tContent("Manage Tests")}</h1>
          <p className="text-gray-500 mt-1">
            {tContent("Total")} {data?.total || 0} {tContent("tests")}
          </p>
        </div>
        <button
          onClick={() => navigate({ to: "/admin/tests/create" })}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" />
          <span>{tContent("Create New Test")}</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <TestTube className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.total || 0}</p>
              <p className="text-sm text-gray-500">{tContent("Total Tests")}</p>
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
                {data?.data.reduce((acc, t) => acc + (t.total_questions || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">{tContent("Total Questions")}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.data.reduce((acc, t) => acc + (t.total_assessments || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">{tContent("Total Assessments")}</p>
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
            placeholder={tContent("Search tests...")}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Test")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Description")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Company")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Questions")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Attempts")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Created Date")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((test) => (
                <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <TestTube className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{test.title}</p>
                        <p className="text-xs text-gray-400">{test.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600 line-clamp-2">{test.description || "—"}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-700">{test.company_name || "System"}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-900">{test.total_questions || 0}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-gray-900">{test.total_assessments || 0}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(test.created_at).toLocaleDateString("vi-VN")}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate({ to: `/admin/tests/${test.id}` })}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={tContent("View Details")}
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => navigate({ to: `/admin/tests/${test.id}` })}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={tContent("Edit")}
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={tContent("Delete")}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {tContent("Showing")} {(page - 1) * limit + 1} - {Math.min(page * limit, data?.total || 0)} {tContent("of")}{" "}
            {data?.total || 0} {tContent("results")}
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
              {tContent("Page")} {page} / {data?.total_pages || 1}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= (data?.total_pages || 1)}
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
