import { AppShell } from "../../components/layout/AppShell";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import api from "../../libs/api";
import { CreditCard, Calendar, Users, FileText, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";

interface Subscription {
  id: string;
  package_code: string;
  package_name: string;
  start_date: string;
  end_date: string;
  max_tests: number;
  max_candidates: number;
  used_tests: number;
  used_candidates: number;
  status: "active" | "expired" | "pending";
}

export default function CompanySubscriptionPage() {
  const navigate = useNavigate();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["company", "subscription"],
    queryFn: async () => {
      const { data } = await api.get<Subscription>("/company/subscription");
      return data;
    },
  });

  const daysRemaining = subscription
    ? Math.ceil((new Date(subscription.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const testsPercent = subscription ? (subscription.used_tests / subscription.max_tests) * 100 : 0;

  const candidatesPercent = subscription ? (subscription.used_candidates / subscription.max_candidates) * 100 : 0;

  if (isLoading) {
    return (
      <AppShell activeNav="subscription">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </AppShell>
    );
  }

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

  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  return (
    <AppShell activeNav="subscription">
      <div className="space-y-6">
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

        {(isExpiringSoon || isExpired) && (
          <div
            className={`border rounded-lg p-4 flex items-start gap-3 ${
              isExpired ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"
            }`}
          >
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isExpired ? "text-red-600" : "text-orange-600"}`} />
            <div>
              <p className={`font-medium ${isExpired ? "text-red-900" : "text-orange-900"}`}>
                {isExpired ? "Gói đăng ký đã hết hạn" : `Gói đăng ký sắp hết hạn (còn ${daysRemaining} ngày)`}
              </p>
              <p className={`text-sm mt-1 ${isExpired ? "text-red-700" : "text-orange-700"}`}>
                {isExpired
                  ? "Vui lòng gia hạn để tiếp tục sử dụng dịch vụ"
                  : "Hãy gia hạn sớm để tránh gián đoạn dịch vụ"}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{subscription.package_name}</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    subscription.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {subscription.status === "active" ? "Đang hoạt động" : "Hết hạn"}
                </span>
              </div>
              <p className="text-gray-500">Mã gói: {subscription.package_code.toUpperCase()}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Ngày bắt đầu</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(subscription.start_date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-xs text-gray-500">Ngày hết hạn</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(subscription.end_date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-purple-700">Còn lại</p>
                <p className="text-sm font-bold text-purple-900">
                  {daysRemaining > 0 ? `${daysRemaining} ngày` : "Đã hết hạn"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Số bài test</span>
                </div>
                <span className="text-sm text-gray-600">
                  {subscription.used_tests} / {subscription.max_tests}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    testsPercent >= 90
                      ? "bg-red-500"
                      : testsPercent >= 70
                        ? "bg-orange-500"
                        : "bg-gradient-to-r from-purple-600 to-pink-600"
                  }`}
                  style={{ width: `${Math.min(testsPercent, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-900">Số ứng viên</span>
                </div>
                <span className="text-sm text-gray-600">
                  {subscription.used_candidates} / {subscription.max_candidates}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${
                    candidatesPercent >= 90
                      ? "bg-red-500"
                      : candidatesPercent >= 70
                        ? "bg-orange-500"
                        : "bg-gradient-to-r from-purple-600 to-pink-600"
                  }`}
                  style={{ width: `${Math.min(candidatesPercent, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

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
                <p className="text-sm text-gray-500">Tăng giới hạn và thời gian sử dụng</p>
              </div>
            </button>

            <button
              //   onClick={() => navigate({ to: "/company/dashboard" })}
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Xem thống kê</p>
                <p className="text-sm text-gray-500">Theo dõi sử dụng chi tiết</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
