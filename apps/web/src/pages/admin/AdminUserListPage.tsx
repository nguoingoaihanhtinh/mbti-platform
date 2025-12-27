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
import { useDynamicTranslation } from "../../libs/translations";
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
  const { tContent } = useDynamicTranslation();

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
      setCreateError(tContent("Please enter company name"));
      return;
    }
    if (newUser.role === "company" && !newUser.company_name.trim()) {
      setCreateError(tContent("Please enter company name"));
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
    if (!confirm(tContent("Are you sure you want to delete this user? This action cannot be undone."))) {
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
        <div className="text-gray-500">{tContent("Loading users list...")}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{tContent("Manage Users")}</h1>
          <p className="text-gray-500 mt-1">
            {tContent("Total users in system").replace("{count}", String(data?.total || 0))}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
        >
          <User className="w-4 h-4" />
          {tContent("Add user")}
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
              <p className="text-sm text-gray-500">{tContent("Total users")}</p>
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
              <p className="text-sm text-gray-500">{tContent("Admins")}</p>
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
              <p className="text-sm text-gray-500">{tContent("Companies")}</p>
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
              <p className="text-sm text-gray-500">{tContent("Candidates")}</p>
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
              placeholder={tContent("Search by name or email...")}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          >
            <option value="">{tContent("All roles")}</option>
            <option value="admin">{tContent("Admin")}</option>
            <option value="company">{tContent("Company")}</option>
            <option value="candidate">{tContent("Candidate")}</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("User")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Email")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Role")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Created At")}</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Information")}</th>
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
                          title={tContent("Delete user")}
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
            {tContent("Showing")} {(page - 1) * limit + 1} - {Math.min(page * limit, data?.total || 0)} {tContent("of")}{" "}
            {data?.total || 0} {tContent("results")}
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
              {tContent("Page")} {page} / {data?.total_pages || 1}
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">{tContent("Create New User")}</h2>

              {createError && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{createError}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{tContent("Full name *")}</label>
                  <input
                    type="text"
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder={tContent("Enter full name")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{tContent("Email *")}</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder={tContent("Enter email")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{tContent("Password *")}</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{tContent("Role *")}</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="candidate">{tContent("Candidate")}</option>
                    <option value="company">{tContent("Company")}</option>
                    <option value="admin">{tContent("Admin")}</option>
                  </select>
                </div>
                {newUser.role === "company" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{tContent("Company Name *")}</label>
                    <input
                      type="text"
                      value={newUser.company_name}
                      onChange={(e) => setNewUser({ ...newUser, company_name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder={tContent("Enter company name")}
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  {tContent("Cancel")}
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg disabled:opacity-50"
                >
                  {isCreating ? tContent("Creating...") : tContent("Create user")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
