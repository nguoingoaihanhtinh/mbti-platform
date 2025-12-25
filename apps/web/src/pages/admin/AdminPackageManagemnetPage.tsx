import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import api from "../../libs/api";
import { Plus, Edit, Trash2, Package, Users, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { useDynamicTranslation } from "../../libs/translations";
interface PackageItem {
  id: string;
  name: string;
  code: string;
  price_per_month: number;
  max_assignments: number;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  benefits: string[];
}

export default function AdminPackagesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { tContent } = useDynamicTranslation();
  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["admin", "packages"],
    queryFn: async () => {
      const { data } = await api.get<PackageItem[]>("/admin/packages");
      return data;
    },
  });
  // useEffect(() => {
  //   console.log("Packages data:", packages);
  //   if (!Array.isArray(packages)) {
  //     console.error("Cache bị ghi đè! Key bị trùng.");
  //   }
  // }, [packages]);
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
      alert(tContent("Package deleted successfully!"));
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || tContent("An error occurred"));
    },
  });

  const handleDelete = (id: string) => {
    if (confirm(tContent("Are you sure you want to delete this package?"))) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{tContent("Loading...")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tContent("Manage Packages")}</h1>
          <p className="text-gray-500 mt-1">
            {tContent("Total")} {packages.length} {tContent("packages")}
          </p>
        </div>
        <button
          onClick={() => navigate({ to: "/admin/packages/create" })}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          {tContent("Create New Package")}
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            {/* Header */}
            <div>
              <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
              <p className="text-sm text-gray-500">{pkg.code.toUpperCase()}</p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 text-sm">
              {pkg.is_active ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-700">{tContent("Active")}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-700">{tContent("Inactive")}</span>
                </>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span className="text-2xl font-bold">
                {pkg.price_per_month.toLocaleString()} {tContent("VND")}
              </span>
            </div>

            {/* Assignments */}
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4 text-purple-600" />
              <span>
                <strong>{pkg.max_assignments}</strong> {tContent("assignments")}
              </span>
            </div>

            {/* Description */}
            {pkg.description && <p className="text-sm text-gray-600">{pkg.description}</p>}

            {/* Benefits */}
            {pkg.benefits.length > 0 && (
              <div className="text-sm text-gray-600 space-y-1">
                {pkg.benefits.slice(0, 3).map((b, i) => (
                  <p key={i}>• {b}</p>
                ))}
                {pkg.benefits.length > 3 && (
                  <p className="text-purple-600">
                    +{pkg.benefits.length - 3} {tContent("other benefits")}
                  </p>
                )}
              </div>
            )}

            {/* Created */}
            <div className="text-xs text-gray-400">
              {tContent("Created on")} {new Date(pkg.created_at).toLocaleDateString("vi-VN")}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => navigate({ to: `/admin/packages/${pkg.id}/edit` })}
                className="flex-1 border rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4" /> {tContent("Edit")}
              </button>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="flex-1 border border-red-300 text-red-600 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" /> {tContent("Delete")}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty */}
      {packages.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{tContent("No packages available")}</h3>
          <button
            onClick={() => navigate({ to: "/admin/packages/create" })}
            className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" /> {tContent("Create New Package")}
          </button>
        </div>
      )}
    </div>
  );
}
