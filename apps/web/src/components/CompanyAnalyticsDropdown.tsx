// CompanyAnalyticsDropdown.tsx
import { useEffect } from "react";
import { useCompanyAnalytics } from "../hooks/useAdmin";
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

const COLORS = ["#9333ea", "#ec4899", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

interface Props {
  companyId: string;
  isOpen: boolean;
}

export default function CompanyAnalyticsDropdown({ companyId, isOpen }: Props) {
  const { data, isLoading, error, refetch } = useCompanyAnalytics(companyId);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  if (!isOpen) return null;

  if (isLoading) {
    return <div className="p-4 border-t border-gray-100 bg-gray-50 text-gray-500">Đang tải phân tích...</div>;
  }

  if (error) {
    return <div className="p-4 border-t border-gray-100 bg-gray-50 text-red-500">Không thể tải dữ liệu phân tích</div>;
  }

  const hasData = data?.monthly_assignments.length || data?.test_preferences.length;

  if (!hasData) {
    return (
      <div className="p-4 border-t border-gray-100 bg-gray-50 text-gray-500">
        Chưa có dữ liệu phân tích cho công ty này
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Assignments */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Số assignment theo tháng</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data!.monthly_assignments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar dataKey="count" name="Số assignment" fill="#9333ea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Test Preferences */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Xu hướng chọn bài test</h4>
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
                    return `${name}: ${(p * 100).toFixed(0)}%`;
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
