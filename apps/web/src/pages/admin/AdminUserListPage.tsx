// src/pages/admin/AdminUsersPage.tsx
import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import api from "../../libs/api";
import { Search, ChevronLeft, ChevronRight, User, Mail, Calendar, Shield, Building2, UserCircle } from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  full_name: string;
  role: "admin" | "company" | "candidate";
  created_at: string;
  company_id?: string;
  profile?: {
    education?: string;
    experience?: string;
  };
}

interface UsersResponse {
  data: UserItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [roleFilter, setRoleFilter] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users", page, limit],
    queryFn: async () => {
      const { data } = await api.get<UsersResponse>("/admin/users", {
        params: { page, limit },
      });
      return data;
    },
  });

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: { bg: "bg-red-100", text: "text-red-700", icon: Shield },
      company: { bg: "bg-purple-100", text: "text-purple-700", icon: Building2 },
      candidate: { bg: "bg-blue-100", text: "text-blue-700", icon: UserCircle },
    };
    return styles[role as keyof typeof styles] || styles.candidate;
  };

  const filteredUsers = data?.data.filter((user) => {
    if (!roleFilter) return true;
    return user.role === roleFilter;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải danh sách users...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Users</h1>
          <p className="text-gray-500 mt-1">Tổng số {data?.total || 0} users trong hệ thống</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-600 to-gray-400 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data?.total || 0}</p>
              <p className="text-sm text-gray-500">Tổng users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.data.filter((u) => u.role === "admin").length || 0}
              </p>
              <p className="text-sm text-gray-500">Admins</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.data.filter((u) => u.role === "company").length || 0}
              </p>
              <p className="text-sm text-gray-500">Companies</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.data.filter((u) => u.role === "candidate").length || 0}
              </p>
              <p className="text-sm text-gray-500">Candidates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">Tất cả roles</option>
            <option value="admin">Admin</option>
            <option value="company">Company</option>
            <option value="candidate">Candidate</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">User</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Role</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Ngày tạo</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thông tin</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user) => {
                const roleInfo = getRoleBadge(user.role);
                const RoleIcon = roleInfo.icon;

                return (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-xs text-gray-400">{user.id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${roleInfo.bg} ${roleInfo.text}`}
                      >
                        <RoleIcon className="w-4 h-4" />
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {user.profile?.education && <p className="text-sm text-gray-600">{user.profile.education}</p>}
                      {user.company_id && (
                        <p className="text-xs text-gray-400">Company ID: {user.company_id.substring(0, 8)}</p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, data?.total || 0)} của {data?.total || 0} kết
            quả
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Trang {page} / {data?.total_pages || 1}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= (data?.total_pages || 1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
