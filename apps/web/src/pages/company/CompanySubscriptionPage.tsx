import { AppShell } from "../../components/layout/AppShell";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import api from "../../libs/api";
import { CreditCard, Users, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

/* =======================
   Types (match backend)
======================= */

interface Package {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
  max_assignments: number;
  price_per_month: number;
}

interface Subscription {
  id: string;
  company_id: string;
  used_assignments: number;
  created_at: string;
  updated_at: string;
  package_id: string;
  packages: Package;
}

/* =======================
   Component
======================= */

export default function CompanySubscriptionPage() {
  const navigate = useNavigate();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["company", "subscription"],
    queryFn: async () => {
      const { data } = await api.get<Subscription | null>("/company/subscription");
      return data;
    },
  });

  /* =======================
     Loading
  ======================= */

  if (isLoading) {
    return (
      <AppShell activeNav="subscription">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </AppShell>
    );
  }

  /* =======================
     No subscription
  ======================= */

  if (!subscription) {
    return (
      <AppShell activeNav="subscription">
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Chưa có gói đăng ký</h2>
            <p className="text-gray-600 mb-6">Bạn chưa đăng ký gói dịch vụ nào. Hãy chọn gói phù hợp để bắt đầu.</p>
            <button
              onClick={() => navigate({ to: "/company/packages" })}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              Xem các gói dịch vụ
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  /* =======================
     Derived values
  ======================= */

  const { packages } = subscription;

  const maxAssignments = packages.max_assignments;
  const usedAssignments = subscription.used_assignments;

  const assignmentsPercent = maxAssignments > 0 ? (usedAssignments / maxAssignments) * 100 : 0;

  const status = packages.is_active ? "active" : "inactive";

  /* =======================
     Render
  ======================= */

  return (
    <AppShell activeNav="subscription">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gói hiện tại</h1>
            <p className="text-gray-500 mt-1">Quản lý gói đăng ký của bạn</p>
          </div>
          <button
            onClick={() => navigate({ to: "/company/packages" })}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Nâng cấp gói
          </button>
        </div>

        {/* Package Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{packages.name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {status === "active" ? "Đang hoạt động" : "Không khả dụng"}
                </span>
              </div>
              <p className="text-gray-500">Mã gói: {packages.code.toUpperCase()}</p>
              <p className="text-sm text-gray-500 mt-1">
                Giá: {packages.price_per_month.toLocaleString("vi-VN")} ₫ / tháng
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          {/* Assignment Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900">Số lượt phân công</span>
              </div>
              <span className="text-sm text-gray-600">
                {usedAssignments} / {maxAssignments}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  assignmentsPercent >= 90
                    ? "bg-red-500"
                    : assignmentsPercent >= 70
                      ? "bg-orange-500"
                      : "bg-gradient-to-r from-purple-600 to-pink-600"
                }`}
                style={{
                  width: `${Math.min(assignmentsPercent, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate({ to: "/company/packages" })}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Nâng cấp gói</p>
                <p className="text-sm text-gray-500">Tăng giới hạn sử dụng</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Xem thống kê</p>
                <p className="text-sm text-gray-500">Theo dõi mức sử dụng</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
