import { useEffect, useState } from "react";
import { useCompanyAnalytics } from "../hooks/useAdmin";
import { Download, TrendingUp, FileText, Trophy } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../libs/api";
import { useDynamicTranslation } from "../libs/translations";
const COLORS = ["#9333ea", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

interface Props {
  companyId: string;
  isOpen: boolean;
}

export default function CompanyAnalyticsDropdown({ companyId, isOpen }: Props) {
  const { data, isLoading, error, refetch } = useCompanyAnalytics(companyId);
  const [exporting, setExporting] = useState(false);
  const { tContent } = useDynamicTranslation();

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const response = await api.get(`/admin/companies/${companyId}/export-pdf`, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `company-dashboard-${companyId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Không thể xuất PDF. Vui lòng thử lại.");
    } finally {
      setExporting(false);
    }
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="p-6 border-t border-gray-100 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center text-gray-500">{tContent("Loading analytics...")}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border-t border-gray-100 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center text-red-500">{tContent("Unable to load analytics data")}</div>
      </div>
    );
  }

  const hasData = data?.monthly_assignments.length || data?.test_preferences.length;

  if (!hasData) {
    return (
      <div className="p-6 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center text-gray-500">{tContent("No analytics data available for this company")}</div>
      </div>
    );
  }

  // Calculate summary stats
  const totalAssignments = data?.monthly_assignments.reduce((sum, item) => sum + item.count, 0) || 0;
  const avgPerMonth = data?.monthly_assignments.length
    ? Math.round(totalAssignments / data.monthly_assignments.length)
    : 0;
  const mostPopularTest = data?.test_preferences.length > 0 ? data.test_preferences[0].test_title : "N/A";
  const totalTests = data?.test_preferences.length || 0;

  return (
    <div className="border-t border-gray-100 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="p-6 space-y-6">
        {/* Header with Export Button */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{tContent("Company Detailed Analytics")}</h3>
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">{exporting ? "Đang xuất..." : "Xuất PDF"}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{tContent("Total assignments")}</p>
                <p className="text-xl font-bold text-gray-900">{totalAssignments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{tContent("Average per month")}</p>
                <p className="text-xl font-bold text-gray-900">{avgPerMonth}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{tContent("Number of test types")}</p>
                <p className="text-xl font-bold text-gray-900">{totalTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center">
                <span className="text-white text-lg font-bold">★</span>
              </div>
              <div>
                <p className="text-xs text-gray-500">{tContent("Most popular test")}</p>
                <p className="text-xs font-semibold text-gray-900 truncate" title={mostPopularTest}>
                  {mostPopularTest.length > 12 ? mostPopularTest.substring(0, 12) + "..." : mostPopularTest}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Assignments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              {tContent("Monthly assignments")}
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data!.monthly_assignments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar dataKey="count" name="Số assignment" fill="#9333ea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Test Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-pink-600"></div>
              {tContent("Test Preferences")}
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data!.test_preferences}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => {
                      const p = typeof percent === "number" ? percent : 0;
                      const displayName = name || "Unknown";
                      const shortName = displayName.length > 15 ? displayName.substring(0, 15) + "..." : displayName;
                      return `${shortName}: ${(p * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="test_title"
                  >
                    {data!.test_preferences.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Test Details List */}
        {data?.test_preferences && data.test_preferences.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              {tContent("Test Details List")}
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {data.test_preferences.map((test, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-gray-700">{test.test_title}</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    {test.count} {tContent("times")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
