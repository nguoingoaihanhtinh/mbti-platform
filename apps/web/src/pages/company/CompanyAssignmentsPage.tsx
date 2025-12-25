// src/pages/company/CompanyAssignmentsPage.tsx
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAssignments } from "../../hooks/useAssignments";
import {
  Plus,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";
import { useDynamicTranslation } from "../../libs/translations";
export default function CompanyAssignmentsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { tContent } = useDynamicTranslation();
  const { data: rawData, isLoading } = useAssignments(page, limit, statusFilter);

  const data = rawData;

  const filteredData = data?.data.filter((assignment) => {
    const matchesStatus = !statusFilter || assignment.status === statusFilter;
    const searchText = searchTerm.toLowerCase();

    const matchesSearch =
      !searchTerm ||
      assignment.guest_fullname?.toLowerCase().includes(searchText) ||
      assignment.guest_email?.toLowerCase().includes(searchText) ||
      assignment.user?.full_name?.toLowerCase().includes(searchText) ||
      assignment.user?.email?.toLowerCase().includes(searchText);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle2,
        label: tContent("Completed"),
      },
      in_progress: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Clock,
        label: tContent("In Progress"),
      },
      assigned: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        icon: Send,
        label: tContent("Assigned"),
      },
    };
    return (
      styles[status as keyof typeof styles] || {
        bg: "bg-gray-100",
        text: "text-gray-700",
        icon: AlertCircle,
        label: tContent("Unknown"),
      }
    );
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">{tContent("Loading assignments list...")}</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell activeNav="assignments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tContent("Manage Assignments")}</h1>
            <p className="text-gray-500 mt-1">{tContent("Track sent tests and candidate results")}</p>
          </div>
          <button
            onClick={() => navigate({ to: "/company/assignments/create" })}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow"
          >
            <Plus className="w-4 h-4" />
            <span> {tContent("Send new test")}</span>
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{data?.total || 0}</p>
                <p className="text-sm text-gray-500">{tContent("Total assignments")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center">
                <Send className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.data.filter((a) => a.status === "assigned").length || 0}
                </p>
                <p className="text-sm text-gray-500">{tContent("Sent")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.data.filter((a) => a.status === "in_progress").length || 0}
                </p>
                <p className="text-sm text-gray-500">{tContent("In Progress")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.data.filter((a) => a.status === "completed").length || 0}
                </p>
                <p className="text-sm text-gray-500">{tContent("Completed")}</p>
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
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">{tContent("All statuses")}</option>
              <option value="assigned">{tContent("Assigned")}</option>
              <option value="in_progress">{tContent("In progress")}</option>
              <option value="completed">{tContent("Completed")}</option>
            </select>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Candidate")}</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Test")}</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Status")}</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Sent Date")}</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Result")}</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">{tContent("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.map((assignment) => {
                  const statusInfo = getStatusBadge(assignment.status);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={assignment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            {assignment.user ? (
                              <>
                                <p className="font-medium text-gray-900">{assignment.user.full_name}</p>
                                <p className="text-sm text-gray-500">{assignment.user.email}</p>
                              </>
                            ) : assignment.guest_email ? (
                              <>
                                <p className="font-medium text-gray-900">
                                  {assignment.guest_fullname || tContent("Guest")}
                                </p>
                                <p className="text-sm text-gray-500">{assignment.guest_email || tContent("Guest")}</p>
                              </>
                            ) : (
                              <p className="font-medium text-gray-900">{tContent("N/A")}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-gray-900">{assignment.test?.title || "N/A"}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm">
                          <p className="text-gray-900">
                            {assignment.created_at
                              ? new Date(assignment.created_at).toLocaleDateString("vi-VN")
                              : "N/A"}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {assignment.created_at
                              ? new Date(assignment.created_at).toLocaleTimeString("vi-VN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {assignment.result ? (
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                            {assignment.result.mbti_type}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">{tContent("Not completed yet")}</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {assignment.status === "completed" ? (
                            <button
                              onClick={() => {
                                const email = assignment.guest_email || assignment.user?.email;
                                navigate({
                                  to: "/company/results/$id",
                                  params: { id: assignment.id },
                                  search: { email: email || undefined },
                                });
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Xem kết quả"
                            >
                              <Eye className="w-4 h-4 text-gray-600" />
                            </button>
                          ) : (
                            <button
                              disabled
                              className="p-2 rounded-lg opacity-50 cursor-not-allowed"
                              title="Chưa hoàn thành"
                            >
                              <Eye className="w-4 h-4 text-gray-400" />
                            </button>
                          )}
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
              {tContent("Showing")} {(page - 1) * limit + 1} - {Math.min(page * limit, data?.total || 0)}{" "}
              {tContent("of")} {data?.total || 0} {tContent("results")}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.ceil((data?.total || 0) / limit) }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 3), Math.min(Math.ceil((data?.total || 0) / limit), page + 2))
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg ${
                        p === page
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
              </div>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= Math.ceil((data?.total || 0) / limit)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
