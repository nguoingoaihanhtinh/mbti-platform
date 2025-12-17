// import { useState } from "react";

// import { useTestCandidates } from "../../hooks/useHr";
// import { Eye, Download, Search, Filter, ChevronLeft, ChevronRight, User } from "lucide-react";
// import { HRShell } from "../../components/layout/HRShell";

// const DEFAULT_TEST_ID = "465c0214-ba18-46d7-b56e-325cf252856e";

// export default function HRCandidatesPage() {
//   const [page, setPage] = useState(1);
//   const [limit] = useState(20);
//   const [testId] = useState(DEFAULT_TEST_ID);

//   const { data, isLoading, error } = useTestCandidates(testId, page, limit);

//   const getStatusBadge = (status: string) => {
//     const styles = {
//       completed: "bg-green-100 text-green-700",
//       in_progress: "bg-yellow-100 text-yellow-700",
//       not_started: "bg-gray-100 text-gray-700",
//     };
//     return styles[status as keyof typeof styles] || styles.not_started;
//   };

//   const getMBTIBadge = (typeCode: string) => {
//     const colors = [
//       "bg-purple-100 text-purple-700",
//       "bg-pink-100 text-pink-700",
//       "bg-blue-100 text-blue-700",
//       "bg-green-100 text-green-700",
//     ];
//     const hash = typeCode.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
//     return colors[hash % colors.length];
//   };

//   if (isLoading) {
//     return (
//       <HRShell activeNav="candidates">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-gray-500">Đang tải danh sách ứng viên...</div>
//         </div>
//       </HRShell>
//     );
//   }

//   if (error) {
//     return (
//       <HRShell activeNav="candidates">
//         <div className="flex items-center justify-center h-64">
//           <div className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</div>
//         </div>
//       </HRShell>
//     );
//   }

//   return (
//     <HRShell activeNav="candidates">
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Danh sách ứng viên</h1>
//             <p className="text-gray-500 mt-1">Quản lý và theo dõi kết quả của ứng viên</p>
//           </div>
//           <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow">
//             <Download className="w-4 h-4" />
//             <span>Xuất danh sách</span>
//           </button>
//         </div>

//         {/* Stats Summary */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
//                 <User className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-900">{data?.candidates.length || 0}</p>
//                 <p className="text-sm text-gray-500">Tổng ứng viên</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-green-400 flex items-center justify-center">
//                 <span className="text-white text-lg font-bold">✓</span>
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {data?.candidates.filter((c) => c.status === "completed").length || 0}
//                 </p>
//                 <p className="text-sm text-gray-500">Đã hoàn thành</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center">
//                 <span className="text-white text-lg font-bold">⏱</span>
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-gray-900">
//                   {data?.candidates.filter((c) => c.status === "in_progress").length || 0}
//                 </p>
//                 <p className="text-sm text-gray-500">Đang làm</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//           <div className="flex items-center gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm theo tên hoặc email..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
//               />
//             </div>
//             <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
//               <Filter className="w-4 h-4" />
//               <span>Lọc</span>
//             </button>
//           </div>
//         </div>

//         {/* Candidates Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr className="border-b border-gray-200">
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Ứng viên</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Email</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">MBTI</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Ngày hoàn thành</th>
//                   <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Hành động</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data?.candidates.map((candidate) => (
//                   <tr key={candidate.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-3">
//                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
//                           <User className="w-5 h-5 text-purple-600" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">{candidate.users.full_name}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <p className="text-sm text-gray-600">{candidate.users.email}</p>
//                     </td>
//                     <td className="py-4 px-6">
//                       {candidate.results &&
//                       candidate.results.length > 0 &&
//                       candidate.results[0].mbti_types?.type_code ? (
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm font-medium ${getMBTIBadge(
//                             candidate.results[0].mbti_types.type_code
//                           )}`}
//                         >
//                           {candidate.results[0].mbti_types.type_code}
//                         </span>
//                       ) : (
//                         <span className="text-sm text-gray-400">Chưa có</span>
//                       )}
//                     </td>
//                     <td className="py-4 px-6">
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(candidate.status)}`}
//                       >
//                         {candidate.status === "completed"
//                           ? "Hoàn thành"
//                           : candidate.status === "in_progress"
//                             ? "Đang làm"
//                             : "Chưa bắt đầu"}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       {candidate.completed_at ? (
//                         <div className="text-sm">
//                           <p className="text-gray-900">
//                             {new Date(candidate.completed_at).toLocaleDateString("vi-VN")}
//                           </p>
//                           <p className="text-gray-400 text-xs">
//                             {new Date(candidate.completed_at).toLocaleTimeString("vi-VN", {
//                               hour: "2-digit",
//                               minute: "2-digit",
//                             })}
//                           </p>
//                         </div>
//                       ) : (
//                         <span className="text-sm text-gray-400">-</span>
//                       )}
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => {
//                             console.log("Navigating to:", `/hr/candidates/${candidate.id}`);
//                             window.location.href = `/hr/candidates/${candidate.id}`;
//                           }}
//                           className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                           title="Xem chi tiết"
//                         >
//                           <Eye className="w-4 h-4 text-gray-600" />
//                         </button>
//                         <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Tải báo cáo">
//                           <Download className="w-4 h-4 text-gray-600" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
//             <div className="text-sm text-gray-600">
//               Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, data?.total || 0)} của {data?.total || 0} kết
//               quả
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setPage((p) => Math.max(1, p - 1))}
//                 disabled={page === 1}
//                 className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ChevronLeft className="w-5 h-5" />
//               </button>
//               <div className="flex items-center gap-1">
//                 {Array.from({ length: Math.ceil((data?.total || 0) / limit) }, (_, i) => i + 1)
//                   .slice(Math.max(0, page - 3), Math.min(Math.ceil((data?.total || 0) / limit), page + 2))
//                   .map((p) => (
//                     <button
//                       key={p}
//                       onClick={() => setPage(p)}
//                       className={`w-10 h-10 rounded-lg ${
//                         p === page
//                           ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
//                           : "text-gray-700 hover:bg-gray-100"
//                       }`}
//                     >
//                       {p}
//                     </button>
//                   ))}
//               </div>
//               <button
//                 onClick={() => setPage((p) => p + 1)}
//                 disabled={page >= Math.ceil((data?.total || 0) / limit)}
//                 className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <ChevronRight className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </HRShell>
//   );
// }
