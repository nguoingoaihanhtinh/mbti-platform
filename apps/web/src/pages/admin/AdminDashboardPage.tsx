import { useMemo } from "react";
import { Users, FileText, Calendar, Download, Trophy, Clock } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAdminDashboardStats, useAdminTimeline } from "../../hooks/useAdmin";
// import type { AdminDashboardStats, AdminTimelineItem } from "../../hooks/useAdmin";
import type { AdminTimelineItem } from "../../hooks/useAdmin";

const COLORS = {
  primary: "#9333ea",
  secondary: "#ec4899",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.info, COLORS.warning];

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminDashboardStats();
  const { data: timelineData, isLoading: timelineLoading } = useAdminTimeline();

  const completionChartData = useMemo(() => {
    if (!stats) return [];
    // return processCompletionData(stats);
    return processCompletionData();
  }, [stats]);

  const timelineChartData = useMemo(() => {
    if (!timelineData) return [];
    return processTimelineData(timelineData);
  }, [timelineData]);

  const summaryStats = useMemo(() => {
    const totalCompletions = stats?.total_completed || 0;
    const uniqueCompanies = 0;
    const uniqueCandidates = new Set(timelineData?.map((t) => t.email)).size;
    const mostTakenTest = stats?.most_taken_tests?.[0];

    return {
      totalCompletions,
      uniqueCompanies,
      uniqueCandidates,
      mostTakenTest,
    };
  }, [stats, timelineData]);

  // MBTI distribution for pie chart
  const mbtiDistributionData = useMemo(() => {
    if (!stats?.mbti_distribution || stats.mbti_distribution.length === 0) {
      return [
        { name: "ENFP", value: 2 },
        { name: "INTJ", value: 1 },
        { name: "ESFJ", value: 1 },
      ];
    }
    return stats.mbti_distribution.map((item) => ({
      name: item.mbti_type,
      value: Math.round((item.percentage / 100) * stats.total_completed),
    }));
  }, [stats]);

  // Most taken tests for bar chart
  const testPopularityData = useMemo(() => {
    if (!stats?.most_taken_tests || stats.most_taken_tests.length === 0) {
      return [];
    }
    return stats.most_taken_tests.map((test) => ({
      name: test.title.length > 30 ? test.title.substring(0, 30) + "..." : test.title,
      value: test.taken_count,
    }));
  }, [stats]);

  const loading = statsLoading || timelineLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Xin chào, Admin</h1>
          <p className="text-gray-500 mt-1">Chào mừng trở lại với dashboard quản trị</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow">
          <Download className="w-4 h-4" />
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng lượt hoàn thành"
          value={summaryStats.totalCompletions}
          icon={Users}
          color="from-purple-600 to-purple-400"
          change={`${summaryStats.totalCompletions} lượt`}
        />
        <StatCard
          title="Ứng viên duy nhất"
          value={summaryStats.uniqueCandidates}
          icon={FileText}
          color="from-pink-600 to-pink-400"
          change={`${summaryStats.uniqueCandidates} người`}
        />
        <StatCard
          title="Bài test phổ biến"
          value={summaryStats.mostTakenTest?.taken_count || 0}
          icon={Trophy}
          color="from-blue-600 to-blue-400"
          change={summaryStats.mostTakenTest?.title?.substring(0, 15) || "N/A"}
        />
        <StatCard
          title="Công ty đang hoạt động"
          value={stats?.active_companies || 0}
          icon={Calendar}
          color="from-green-600 to-green-400"
          change={`${stats?.active_companies || 0} công ty`}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lượt hoàn thành theo thời gian</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="completions"
                stroke={COLORS.primary}
                strokeWidth={2}
                name="Lượt hoàn thành"
                dot={{ fill: COLORS.primary, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* MBTI Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố MBTI toàn hệ thống</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mbtiDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mbtiDistributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động theo công ty</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timelineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="company"
                stroke="#6b7280"
                style={{ fontSize: "11px" }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Bar dataKey="tests" name="Bài test" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Taken Tests */}
        {testPopularityData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bài test được làm nhiều nhất</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={testPopularityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  style={{ fontSize: "11px" }}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Lượt làm" fill={COLORS.secondary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">Xem tất cả →</button>
        </div>

        <div className="space-y-4">
          {timelineData?.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.candidate}</p>
                <p className="text-sm text-gray-500">
                  {item.email} • {item.company}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">{item.test}</p>
                <p className="text-xs text-gray-400">
                  {new Date(item.date).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== HELPER FUNCTIONS =====
function processCompletionData() {
  const days = 7;
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("vi-VN"),
      completions: Math.floor(Math.random() * 5) + 1,
    });
  }
  return data;
}

function processTimelineData(timeline: AdminTimelineItem[]) {
  const companyMap = new Map<string, { company: string; tests: number }>();
  timeline.forEach((item) => {
    if (!companyMap.has(item.company)) {
      companyMap.set(item.company, { company: item.company, tests: 0 });
    }
    const current = companyMap.get(item.company)!;
    current.tests += 1;
  });
  return Array.from(companyMap.values()).slice(0, 5);
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  change,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  change: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-500 mb-2">{title}</p>
      <p className="text-xs text-gray-400">{change}</p>
    </div>
  );
}
