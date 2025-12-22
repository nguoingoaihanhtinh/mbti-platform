import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../libs/api";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Calendar,
  Shield,
  Building2,
  UserCircle,
  Trash2,
} from "lucide-react";

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
  users: UserItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ["admin", "users", page, limit],
    queryFn: async () => {
      const res = await api.get("/admin/users", {
        params: { page, limit },
      });

      return {
        users: res.data.data,
        total: res.data.pagination.total,
        page: res.data.pagination.page,
        limit: res.data.pagination.limit,
        total_pages: res.data.pagination.total_pages,
      };
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "candidate" as "admin" | "company" | "candidate",
    company_name: "",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateUser = async () => {
    setCreateError(null);
    if (!newUser.email || !newUser.full_name || !newUser.password) {
      setCreateError("Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (newUser.role === "company" && !newUser.company_name.trim()) {
      setCreateError("Vui lòng nhập tên công ty");
      return;
    }
    setIsCreating(true);
    try {
      await api.post("/admin/users", {
        email: newUser.email,
        full_name: newUser.full_name,
        password: newUser.password,
        role: newUser.role,
        company_name: newUser.role === "company" ? newUser.company_name : undefined,
      });

      setIsModalOpen(false);
      setNewUser({ email: "", full_name: "", password: "", role: "candidate", company_name: "" });
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Có lỗi xảy ra khi tạo user");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xoá user này? Hành động này không thể hoàn tác.")) {
      return;
    }

    try {
      await api.post(`/admin/users/${userId}/soft-delete`);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    } catch (err: any) {
      alert(err.response?.data?.message || "Có lỗi xảy ra khi xoá user");
    }
  };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: { bg: "bg-red-100", text: "text-red-700", icon: Shield },
      company: { bg: "bg-purple-100", text: "text-purple-700", icon: Building2 },
      candidate: { bg: "bg-blue-100", text: "text-blue-700", icon: UserCircle },
    };
    return styles[role as keyof typeof styles] || styles.candidate;
  };

  const filteredUsers = data?.users.filter((user) => {
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesSearch =
      !searchTerm ||
      user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
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
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
        >
          <User className="w-4 h-4" />
          Thêm user
        </button>
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
                {data?.users.filter((u) => u.role === "admin").length || 0}
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
                {data?.users.filter((u) => u.role === "company").length || 0}
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
                {data?.users.filter((u) => u.role === "candidate").length || 0}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                      <div className="flex gap-2">
                        {user.profile?.education && <p className="text-sm text-gray-600">{user.profile.education}</p>}
                        {user.company_id && (
                          <p className="text-xs text-gray-400">Company ID: {user.company_id.substring(0, 8)}</p>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Xoá user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Tạo người dùng mới</h2>

              {createError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{createError}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò *</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="candidate">Ứng viên</option>
                    <option value="company">Công ty</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {newUser.role === "company" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên công ty *</label>
                    <input
                      type="text"
                      value={newUser.company_name}
                      onChange={(e) => setNewUser({ ...newUser, company_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Công ty TNHH ABC"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg disabled:opacity-50"
                >
                  {isCreating ? "Đang tạo..." : "Tạo user"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
