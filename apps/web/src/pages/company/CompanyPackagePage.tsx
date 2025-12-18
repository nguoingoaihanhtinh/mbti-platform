// src/pages/company/CompanyPackagesPage.tsx

import { AppShell } from "../../components/layout/AppShell";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../libs/api";
import { Star, Zap } from "lucide-react";

interface Package {
  id: string;
  name: string;
  code: string;
  price_per_month: number;
  max_assignments: number;
  description?: string;
  is_active: boolean;
  is_popular?: boolean;
}

export default function CompanyPackagesPage() {
  const queryClient = useQueryClient();

  const { data: packages, isLoading } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data } = await api.get<Package[]>("/packages");
      return data;
    },
  });

  const { data: currentSub } = useQuery({
    queryKey: ["company", "subscription"],
    queryFn: async () => {
      const { data } = await api.get("/company/subscription");
      return data;
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (packageCode: string) => {
      const { data } = await api.post("/company/subscription", {
        package_code: packageCode,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "subscription"] });
      alert("Đăng ký gói thành công!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleSubscribe = (packageCode: string) => {
    if (confirm("Bạn có chắc chắn muốn đăng ký gói này?")) {
      subscribeMutation.mutate(packageCode);
    }
  };

  const isCurrentPackage = (code: string) => {
    return currentSub?.package_code === code;
  };

  if (isLoading) {
    return (
      <AppShell activeNav="packages">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeNav="packages">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gói dịch vụ</h1>
          <p className="text-gray-500 mt-1">Chọn gói phù hợp với nhu cầu của bạn</p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {packages?.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-xl shadow-sm border-2 p-6 ${
                pkg.is_popular
                  ? "border-purple-600"
                  : isCurrentPackage(pkg.code)
                    ? "border-green-500"
                    : "border-gray-200"
              }`}
            >
              {/* Popular Badge */}
              {pkg.is_popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    PHỔ BIẾN
                  </span>
                </div>
              )}

              {/* Current Package Badge */}
              {isCurrentPackage(pkg.code) && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    GÓI HIỆN TẠI
                  </span>
                </div>
              )}

              {/* Package Name */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{pkg.code.toUpperCase()}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">{pkg.price_per_month.toLocaleString()}</span>
                  <span className="text-gray-500">VNĐ</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">/tháng</p>
              </div>

              {/* Limits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">
                    Tối đa <strong>{pkg.max_assignments}</strong> lượt
                  </span>
                </div>
              </div>

              {/* Description */}
              {pkg.description && <p className="text-sm text-gray-600 mb-6">{pkg.description}</p>}

              {/* Subscribe Button */}
              <button
                onClick={() => handleSubscribe(pkg.code)}
                disabled={isCurrentPackage(pkg.code) || subscribeMutation.isPending}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  isCurrentPackage(pkg.code)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : pkg.is_popular
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {isCurrentPackage(pkg.code)
                  ? "Đang sử dụng"
                  : subscribeMutation.isPending
                    ? "Đang xử lý..."
                    : "Đăng ký ngay"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
