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
import { useCompanyUsers, useDashboardStats } from "../../hooks/useAssignments";

const COLORS = ["#9333ea", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function CompanyDashboardPage() {
  const navigate = useNavigate();

  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: users, isLoading: usersLoading } = useCompanyUsers();

  const loading = statsLoading || usersLoading;

  // Calculate status counts (mock from stats for now)
  const totalAssignments = stats?.total_completed || 0;
  const completed = 1;
  const inProgress = 0;
  const assigned = 7;

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải dashboard...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 mt-1">Tổng quan hoạt động công ty của bạn</p>
          </div>
          <button
            onClick={() => navigate({ to: "/company/assignments/create" })}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
          >
            <Plus className="w-4 h-4" />
            Gửi test mới
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Quota */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Hạn mức</p>
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
            <p className="text-xs text-gray-500 mt-2">Gói: {stats?.quota.package_name}</p>
          </div>

          {/* Total Assignments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng assignments</p>
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
                <p className="text-sm text-gray-500">Nhân viên công ty</p>
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
                <p className="text-sm text-gray-500">Đã hoàn thành</p>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố MBTI</h3>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố MBTI</h3>
              <p className="text-gray-500">Chưa có dữ liệu MBTI</p>
            </div>
          )}

          {/* Assignment Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái Assignment</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Đã gửi", value: assigned },
                  { name: "Đang làm", value: inProgress },
                  { name: "Hoàn thành", value: completed },
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate({ to: "/company/assignments" })}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Quản lý Assignments</h3>
            <p className="text-sm text-gray-500 mt-1">Xem và theo dõi tất cả bài test đã gửi</p>
          </button>

          <button
            onClick={() => navigate({ to: "/company/users" })}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Nhân viên</h3>
            <p className="text-sm text-gray-500 mt-1">Quản lý danh sách nhân viên trong công ty</p>
          </button>

          <button
            onClick={() => navigate({ to: "/company/subscription" })}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mb-4">
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Gói dịch vụ</h3>
            <p className="text-sm text-gray-500 mt-1">Xem và cập nhật gói dịch vụ hiện tại</p>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
