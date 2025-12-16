// src/pages/admin/AdminPackageFormPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../libs/api";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Package,
  DollarSign,
  Calendar,
  Users,
  FileText,
  Star,
} from "lucide-react";

interface PackageFormData {
  name: string;
  code: string;
  price: number;
  duration_days: number;
  max_tests: number;
  max_candidates: number;
  features: string[];
  is_popular?: boolean;
}

export default function AdminPackageFormPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const packageId = (params as any)?.packageId;
  const isEdit = !!packageId;

  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    code: "",
    price: 0,
    duration_days: 30,
    max_tests: 0,
    max_candidates: 0,
    features: [],
    is_popular: false,
  });
  const [featureInput, setFeatureInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  // Fetch package data if editing
  const { data: packageData, isLoading: loadingPackage } = useQuery({
    queryKey: ["admin", "package", packageId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/packages/${packageId}`);
      return data;
    },
    enabled: isEdit,
  });

  // Populate form when data loads
  useEffect(() => {
    if (packageData && isEdit) {
      setFormData({
        name: packageData.name || "",
        code: packageData.code || "",
        price: packageData.price || 0,
        duration_days: packageData.duration_days || 30,
        max_tests: packageData.max_tests || 0,
        max_candidates: packageData.max_candidates || 0,
        features: packageData.features || [],
        is_popular: packageData.is_popular || false,
      });
    }
  }, [packageData, isEdit]);

  const saveMutation = useMutation({
    mutationFn: async (data: PackageFormData) => {
      if (isEdit) {
        const response = await api.put(`/admin/packages/${packageId}`, data);
        return response.data;
      } else {
        const response = await api.post("/admin/packages", data);
        return response.data;
      }
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/admin/packages" });
      }, 2000);
    },
    onError: (error: any) => {
      setErrors({
        submit: error.response?.data?.message || `Có lỗi xảy ra khi ${isEdit ? "cập nhật" : "tạo"} package`,
      });
    },
  });

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Vui lòng nhập tên package";
    if (!formData.code) newErrors.code = "Vui lòng nhập mã package";
    if (formData.price <= 0) newErrors.price = "Giá phải lớn hơn 0";
    if (formData.duration_days <= 0) newErrors.duration_days = "Thời hạn phải lớn hơn 0";
    if (formData.max_tests <= 0) newErrors.max_tests = "Số test phải lớn hơn 0";
    if (formData.max_candidates <= 0) newErrors.max_candidates = "Số ứng viên phải lớn hơn 0";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    saveMutation.mutate(formData);
  };

  if (isEdit && loadingPackage) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/admin/packages" })}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Chỉnh sửa Package" : "Tạo Package Mới"}</h1>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-900 font-medium">{isEdit ? "Cập nhật" : "Tạo"} package thành công!</p>
            <p className="text-green-700 text-sm mt-1">Đang chuyển hướng...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-900 font-medium">Có lỗi xảy ra</p>
            <p className="text-red-700 text-sm mt-1">{errors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Thông tin cơ bản</h2>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên package *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Basic Plan"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mã package *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toLowerCase(),
                    })
                  }
                  placeholder="basic"
                  disabled={isEdit} // Don't allow changing code when editing
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    errors.code ? "border-red-500" : "border-gray-300"
                  } ${isEdit ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
                {errors.code && <p className="text-red-500 text-sm mt-2">{errors.code}</p>}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="rounded"
                />
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Đánh dấu là gói phổ biến</span>
              </label>
            </div>
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Giá & Thời hạn</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Giá (VNĐ) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                placeholder="100000"
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-2">{errors.price}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                Thời hạn (ngày) *
              </label>
              <input
                type="number"
                value={formData.duration_days}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration_days: Number(e.target.value),
                  })
                }
                placeholder="30"
                min="1"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                  errors.duration_days ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.duration_days && <p className="text-red-500 text-sm mt-2">{errors.duration_days}</p>}
            </div>
          </div>
        </div>

        {/* Limits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Giới hạn</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                Số bài test tối đa *
              </label>
              <input
                type="number"
                value={formData.max_tests}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_tests: Number(e.target.value),
                  })
                }
                placeholder="10"
                min="1"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                  errors.max_tests ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.max_tests && <p className="text-red-500 text-sm mt-2">{errors.max_tests}</p>}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4" />
                Số ứng viên tối đa *
              </label>
              <input
                type="number"
                value={formData.max_candidates}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_candidates: Number(e.target.value),
                  })
                }
                placeholder="100"
                min="1"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                  errors.max_candidates ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.max_candidates && <p className="text-red-500 text-sm mt-2">{errors.max_candidates}</p>}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tính năng</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Nhập tính năng và nhấn Enter..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {formData.features.length > 0 && (
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{feature}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/packages" })}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo package"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
