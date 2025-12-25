// src/pages/company/CompanyDashboardPage.tsx
import { useNavigate } from "@tanstack/react-router";
import { Users, FileText, Calendar, Package, Plus } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { AppShell } from "../../components/layout/AppShell";
import { useCompanyUsers, useDashboardStats, useAssignments } from "../../hooks/useAssignments";
import { useQuery } from "@tanstack/react-query";
import api from "../../libs/api";
import { useDynamicTranslation } from "../../libs/translations";

const COLORS = ["#9333ea", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function CompanyDashboardPage() {
  const navigate = useNavigate();
  const { tContent } = useDynamicTranslation();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: users, isLoading: usersLoading } = useCompanyUsers();
  const { data: assignmentsData, isLoading: assignmentsLoading } = useAssignments(1, 1000);

  const { data: timeline, isLoading: timelineLoading } = useQuery({
    queryKey: ["company", "dashboard", "timeline"],
    queryFn: async () => {
      const { data } = await api.get<{ date: string; count: number }[]>("/company/dashboard/timeline");
      return data.map((item) => ({
        date: new Date(item.date).toLocaleDateString("vi-VN"),
        count: item.count,
      }));
    },
  });

  const loading = statsLoading || usersLoading || assignmentsLoading || timelineLoading;

  let completed = 0;
  let inProgress = 0;
  let assigned = 0;
  let totalAssignments = 0;

  if (assignmentsData?.data) {
    assignmentsData.data.forEach((a) => {
      if (a.status === "completed") {
        completed++;
      } else if (a.status === "in_progress") {
        inProgress++;
      } else if (a.status === "assigned") {
        assigned++;
      }
    });
    totalAssignments = completed + inProgress + assigned;
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">{tContent("Loading dashboard...")}</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeNav="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tContent("Dashboard")}</h1>
            <p className="text-gray-500 mt-1">{tContent("Company activity overview")}</p>
          </div>
          <button
            onClick={() => navigate({ to: "/company/assignments/create" })}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
          >
            <Plus className="w-4 h-4" />
            {tContent("Send new test")}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Quota */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{tContent("Quota")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.quota.used || 0} / {stats?.quota.max || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                style={{
                  width: `${stats?.quota.max ? Math.min(100, (stats.quota.used / stats.quota.max) * 100) : 0}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {tContent("Package")}: {stats?.quota.package_name}
            </p>
          </div>

          {/* Total Assignments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{tContent("Total assignments")}</p>
                <p className="text-2xl font-bold text-gray-900">{totalAssignments}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{tContent("Company employees")}</p>
                <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{tContent("Completed")}</p>
                <p className="text-2xl font-bold text-gray-900">{completed}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* MBTI Distribution */}
          {stats?.mbti_distribution && stats.mbti_distribution.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{tContent("MBTI Distribution")}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.mbti_distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                    nameKey="mbti_type"
                  >
                    {stats.mbti_distribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} labelFormatter={(name) => `Loại ${name}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{tContent("MBTI Distribution")}</h3>
              <p className="text-gray-500">{tContent("No MBTI data available")}</p>
            </div>
          )}

          {/* Assignment Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{tContent("Assignment Status")}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: tContent("Assigned"), value: assigned },
                  { name: tContent("In Progress"), value: inProgress },
                  { name: tContent("Completed"), value: completed },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Số lượng">
                  <Cell fill="#9333ea" />
                  <Cell fill="#ec4899" />
                  <Cell fill="#10b981" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {tContent("Usage frequency of assignments in the last 30 days")}
            </h3>
            {timeline && timeline.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value) => [`${value} lượt`, "Số lượng"]}
                    labelFormatter={(label) => `Ngày ${label}`}
                  />
                  <Bar dataKey="count" name="Số assignment" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">{tContent("No usage data in the last 30 days")}</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate({ to: "/company/assignments" })}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{tContent("Manage Assignments")}</h3>
            <p className="text-sm text-gray-500 mt-1">{tContent("View and track all sent tests")}</p>
          </button>

          <button
            onClick={() => navigate({ to: "/company/users" })}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{tContent("Employees")}</h3>
            <p className="text-sm text-gray-500 mt-1">{tContent("Manage employee list")}</p>
          </button>

          <button
            onClick={() => navigate({ to: "/company/subscription" })}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-4">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{tContent("Service Package")}</h3>
            <p className="text-sm text-gray-500 mt-1">{tContent("View and update current package")}</p>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
