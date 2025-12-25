import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, CheckCircle, AlertCircle, Package, DollarSign, Users } from "lucide-react";
import { useAdminPackage } from "../../hooks/useAdmin";
import { useDynamicTranslation } from "../../libs/translations";
import api from "../../libs/api";

interface PackageFormData {
  name: string;
  code: string;
  price_per_month: number;
  max_assignments: number;
  description?: string;
  is_active: boolean;
  benefits?: string[];
}
interface Props {
  packageId?: string;
}

export default function AdminPackageFormPage({ packageId }: Props) {
  const navigate = useNavigate();
  const { tContent } = useDynamicTranslation();
  const isEdit = !!packageId;

  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<PackageFormData>({
    name: "",
    code: "",
    price_per_month: 0,
    max_assignments: 0,
    description: "",
    benefits: [],
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const { data: packageData, isLoading } = useAdminPackage(isEdit ? packageId : undefined);

  useEffect(() => {
    if (packageData && isEdit) {
      setFormData({
        name: packageData.name || "",
        code: packageData.code || "",
        price_per_month: packageData.price_per_month || 0,
        max_assignments: packageData.max_assignments || 0,
        description: packageData.description || "",
        benefits: Array.isArray(packageData.benefits) ? packageData.benefits : [],
        is_active: packageData.is_active !== false,
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
        // console.log("RAW RESPONSE:", response.data);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/admin/packages" });
      }, 2000);
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        `Có lỗi xảy ra khi ${isEdit ? tContent("updating") : tContent("creating")} package`;
      setErrors({ submit: message });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = tContent("Please enter the package name");
    if (!formData.code) newErrors.code = tContent("Please enter the package code");
    if (formData.price_per_month <= 0) newErrors.price_per_month = tContent("Price must be greater than 0");
    if (formData.max_assignments <= 0)
      newErrors.max_assignments = tContent("Number of assignments must be greater than 0");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    saveMutation.mutate(formData);
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{tContent("Loading...")}</div>
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
          <span>{tContent("Back to list")}</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? tContent("Edit Package") : tContent("Create New Package")}
        </h1>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-900 font-medium">
              {isEdit ? tContent("Updated") : tContent("Created")} package {tContent("successfully")}!
            </p>
            <p className="text-green-700 text-sm mt-1">{tContent("Redirecting...")}</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-900 font-medium">{tContent("An error occurred")}</p>
            <p className="text-red-700 text-sm mt-1">{errors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">{tContent("Basic Information")}</h2>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Package Name")} *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={tContent("Basic Plan")}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Package Code")} *</label>
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
                  disabled={isEdit}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                    errors.code ? "border-red-500" : "border-gray-300"
                  } ${isEdit ? "bg-gray-100 cursor-not-allowed" : ""}`}
                />
                {errors.code && <p className="text-red-500 text-sm mt-2">{errors.code}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm text-gray-700">{tContent("Activate this package")}</span>
            </div>
          </div>
        </div>
        {/* Pricing */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">{tContent("Pricing")}</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Price (VND/month)")} *</label>
            <input
              type="number"
              value={formData.price_per_month}
              onChange={(e) => setFormData({ ...formData, price_per_month: Number(e.target.value) })}
              placeholder={tContent("100000")}
              min="0"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                errors.price_per_month ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.price_per_month && <p className="text-red-500 text-sm mt-2">{errors.price_per_month}</p>}
          </div>
        </div>
        {/* Limits */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">{tContent("Limits")}</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Maximum Assignments")} *</label>
            <input
              type="number"
              value={formData.max_assignments}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_assignments: Number(e.target.value),
                })
              }
              placeholder="10"
              min="1"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                errors.max_assignments ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.max_assignments && <p className="text-red-500 text-sm mt-2">{errors.max_assignments}</p>}
          </div>
        </div>
        {/* Description */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{tContent("Description (optional)")}</h2>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder={tContent("Short description of the package...")}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>

        {/* Benefits / Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">{tContent("Benefits / Features")}</h2>
          <div className="space-y-2">
            {(formData.benefits || []).map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => {
                    const newBenefits = [...(formData.benefits || [])];
                    newBenefits[index] = e.target.value;
                    setFormData({ ...formData, benefits: newBenefits });
                  }}
                  placeholder={tContent("e.g., Priority Support")}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newBenefits = [...(formData.benefits || [])];
                    newBenefits.splice(index, 1);
                    setFormData({ ...formData, benefits: newBenefits });
                  }}
                  className="px-3 text-red-600 hover:text-red-800"
                >
                  {tContent("Remove")}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  benefits: [...(formData.benefits || []), ""],
                });
              }}
              className="text-sm text-purple-600 hover:text-purple-800 font-medium"
            >
              + {tContent("Add Feature")}
            </button>
          </div>
        </div>
        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/packages" })}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {tContent("Cancel")}
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>
              {saveMutation.isPending
                ? tContent("Saving...")
                : isEdit
                  ? tContent("Update")
                  : tContent("Create Package")}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
