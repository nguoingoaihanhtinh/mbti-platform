import { Eye, Search, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAdminTestCandidates } from "../../hooks/useAdmin";

const DEFAULT_TEST_ID = "465c0214-ba18-46d7-b56e-325cf252856e";

export default function AdminCandidatesPage() {
  const navigate = useNavigate();
  const { page } = useSearch({ from: "/admin/candidates/" });
  const limit = 20;
  const { data, isLoading, isFetching } = useAdminTestCandidates(DEFAULT_TEST_ID, page, limit);

  const candidates = data?.data ?? [];
  //   console.log("Candidates:", candidates);
  if (isLoading) {
    return <div className="h-64 flex items-center justify-center text-gray-500">Đang tải danh sách ứng viên...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">All Candidates</h1>
        <p className="text-gray-500 mt-1">Quản lý toàn bộ ứng viên trên hệ thống</p>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input className="w-full pl-10 pr-4 py-2 border rounded-lg" placeholder="Tìm theo tên hoặc email" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm">Ứng viên</th>
              <th className="px-6 py-4 text-left text-sm">Email</th>
              <th className="px-6 py-4 text-left text-sm">Bài test</th>
              <th className="px-6 py-4 text-left text-sm">MBTI</th>
              <th className="px-6 py-4 text-left text-sm">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {candidates.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Không có ứng viên nào
                </td>
              </tr>
            )}

            {candidates.map((c) => {
              const user = c.users;
              const name = user?.full_name || c.guest_fullname || "—";
              const email = user?.email || c.guest_email || "—";
              const mbti = c.results?.[0]?.mbti_types?.type_code;

              return (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium">{name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">{email}</td>

                  <td className="px-6 py-4 text-sm">{c.tests?.title}</td>

                  <td className="px-6 py-4">
                    {mbti ? (
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">{mbti}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate({
                          to: "/admin/candidates/$assessmentId",
                          params: { assessmentId: c.id },
                        })
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t">
          <span className="text-sm text-gray-600">Trang {page}</span>

          <div className="flex gap-2">
            <button
              disabled={page === 1 || isFetching}
              onClick={() =>
                navigate({
                  from: "/admin/candidates",
                  search: (prev) => ({
                    page: Math.max(1, (prev?.page ?? 1) - 1),
                  }),
                })
              }
            >
              <ChevronLeft />
            </button>

            <button
              disabled={isFetching}
              onClick={() =>
                navigate({
                  from: "/admin/candidates",
                  search: (prev) => ({
                    page: (prev?.page ?? 1) + 1,
                  }),
                })
              }
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
