// src/pages/company/CompanyProfilePage.tsx
import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useDynamicTranslation } from "../../libs/translations";
import api from "../../libs/api";
import { AppShell } from "../../components/layout/AppShell";
import { User, Globe, MapPin, Phone, Edit3, Save, X } from "lucide-react";

interface CompanyProfile {
  id: string;
  name: string;
  domain?: string;
  logo_url?: string;
  description?: string;
  address?: string;
  phone?: string;
  created_at: string;
}

export default function CompanyProfilePage() {
  const queryClient = useQueryClient();
  const { tContent } = useDynamicTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyProfile>>({
    name: "",
    domain: "",
    description: "",
    address: "",
    phone: "",
  });
  const [originalData, setOriginalData] = useState<CompanyProfile | null>(null);

  // Lấy profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ["company", "profile"],
    queryFn: async () => {
      const { data } = await api.get<CompanyProfile>("/company/profile");
      return data;
    },
  });

  // Cập nhật profile
  const updateMutation = useMutation({
    mutationFn: async (dto: Partial<CompanyProfile>) => {
      const { data } = await api.put("/company/profile", dto);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "profile"] });
      setIsEditing(false);
      alert("Cập nhật thông tin công ty thành công!");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    },
  });

  // Đồng bộ dữ liệu khi load
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        domain: profile.domain || "",
        description: profile.description || "",
        address: profile.address || "",
        phone: profile.phone || "",
      });
      setOriginalData(profile);
    }
  }, [profile]);

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (originalData) {
      setFormData({
        name: originalData.name,
        domain: originalData.domain || "",
        description: originalData.description || "",
        address: originalData.address || "",
        phone: originalData.phone || "",
      });
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <AppShell activeNav="profile">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">{tContent("Loading company information...")}</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeNav="profile">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tContent("Company Information")}</h1>
            <p className="text-gray-500 mt-1">{tContent("Manage and update your company information")}</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
            >
              <Edit3 className="w-4 h-4" />
              {tContent("Edit")}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                {tContent("Cancel")}
              </button>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updateMutation.isPending ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          )}
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tContent("Company Name *")}</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder={tContent("Enter company name")}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile?.name}</span>
                </div>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tContent("Website")}</label>
              {isEditing ? (
                <input
                  type="url"
                  name="domain"
                  value={formData.domain || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder="https://example.com"
                />
              ) : (
                profile?.domain && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={profile.domain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      {profile.domain}
                    </a>
                  </div>
                )
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tContent("Address")}</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder={tContent("Enter address")}
                />
              ) : (
                profile?.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{profile.address}</span>
                  </div>
                )
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tContent("Phone Number")}</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder={tContent("Enter phone number")}
                />
              ) : (
                profile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{profile.phone}</span>
                  </div>
                )
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{tContent("Description")}</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  placeholder={tContent("Company introduction...")}
                />
              ) : (
                profile?.description && <p className="text-gray-700 whitespace-pre-line">{profile.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
