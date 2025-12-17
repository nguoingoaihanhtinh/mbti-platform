import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import api from "../../libs/api";
import { Plus, Edit, Trash2, Package, Calendar, Users, FileText, DollarSign, Star } from "lucide-react";

interface PackageItem {
  id: string;
  name: string;
  code: string;
  price_per_month: number;
  duration_days: number;
  max_tests: number;
  max_candidates: number;
  features: string[];
  is_popular?: boolean;
  created_at: string;
  total_subscriptions?: number;
}

export default function AdminPackagesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["admin", "packages"],
    queryFn: async () => {
      const { data } = await api.get<PackageItem[]>("/admin/packages");
      return data;
    },
  });
  console.log("packages:", packages);
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
      alert("Xóa package thành công!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Có lỗi xảy ra");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa package này?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Packages</h1>
          <p className="text-gray-500 mt-1">Tổng số {packages?.length || 0} packages</p>
        </div>
        <button
          onClick={() => navigate({ to: "/admin/packages/create" })}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo package mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{packages?.length || 0}</p>
              <p className="text-sm text-gray-500">Tổng packages</p>
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
                {packages?.reduce((acc, p) => acc + (p.total_subscriptions || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Tổng subscriptions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{packages?.filter((p) => p.is_popular).length || 0}</p>
              <p className="text-sm text-gray-500">Gói phổ biến</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {packages?.reduce((acc, p) => Math.max(acc, p.price_per_month), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Giá cao nhất (VNĐ)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {packages?.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative bg-white rounded-xl shadow-sm border-2 p-6 ${
              pkg.is_popular ? "border-purple-600" : "border-gray-200"
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

            {/* Package Header */}
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
              <p className="text-sm text-gray-500 mt-1">/{pkg.duration_days} ngày</p>
            </div>

            {/* Limits */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">
                  <strong>{pkg.max_tests}</strong> bài test
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">
                  <strong>{pkg.max_candidates}</strong> ứng viên
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-gray-700">
                  <strong>{pkg.total_subscriptions || 0}</strong> subscriptions
                </span>
              </div>
            </div>

            {/* Features */}
            {pkg.features && pkg.features.length > 0 && (
              <div className="space-y-1 mb-6 text-sm text-gray-600">
                {pkg.features.slice(0, 3).map((feature, index) => (
                  <p key={index}>• {feature}</p>
                ))}
                {pkg.features.length > 3 && (
                  <p className="text-purple-600">+{pkg.features.length - 3} tính năng khác</p>
                )}
              </div>
            )}

            {/* Created Date */}
            <div className="text-xs text-gray-400 mb-4">
              Tạo ngày {new Date(pkg.created_at).toLocaleDateString("vi-VN")}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate({ to: `/admin/packages/${pkg.id}/edit` })}
                className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm">Sửa</span>
              </button>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm">Xóa</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!packages ||
        (packages.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có package nào</h3>
            <p className="text-gray-500 mb-6">Tạo package đầu tiên để bắt đầu</p>
            <button
              onClick={() => navigate({ to: "/admin/packages/create" })}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo package mới</span>
            </button>
          </div>
        ))}
    </div>
  );
}
