import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAvailableTests, useCreateAssignment } from "../../hooks/useAssignments";
import { Send, ArrowLeft, FileText, Mail, User, CheckCircle, AlertCircle } from "lucide-react";
import { AppShell } from "../../components/layout/AppShell";

export default function CompanyCreateAssignmentPage() {
  const navigate = useNavigate();
  const { data: testsData, isLoading: testsLoading } = useAvailableTests();
  const tests = testsData?.data || [];
  const createAssignment = useCreateAssignment();

  const [formData, setFormData] = useState({
    test_id: "",
    candidate_email: "",
    candidate_fullname: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess(false);

    const newErrors: Record<string, string> = {};
    if (!formData.test_id) {
      newErrors.test_id = "Vui lòng chọn bài test";
    }
    if (!formData.candidate_email) {
      newErrors.candidate_email = "Vui lòng nhập email ứng viên";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.candidate_email)) {
      newErrors.candidate_email = "Email không hợp lệ";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // ✅ Gọi API, backend sẽ tự gửi email với assessmentId
      await createAssignment.mutateAsync(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/company/assignments" });
      }, 2000);
    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || "Có lỗi xảy ra khi tạo assignment",
      });
    }
  };

  const selectedTest = tests?.find((t: any) => t.id === formData.test_id);

  if (testsLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải danh sách test...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/company/assignments" })}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Title */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gửi bài test cho ứng viên</h1>
          <p className="text-gray-600">Chọn bài test và nhập thông tin ứng viên để gửi link làm bài</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-900 font-medium">Gửi bài test thành công!</p>
              <p className="text-green-700 text-sm mt-1">Đang chuyển hướng đến danh sách assignments...</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Test Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-4">
              <FileText className="w-5 h-5 text-purple-600" />
              Chọn bài test
            </label>
            <select
              value={formData.test_id}
              onChange={(e) => setFormData({ ...formData, test_id: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                errors.test_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">-- Chọn bài test --</option>
              {tests?.map((test: any) => (
                <option key={test.id} value={test.id}>
                  {test.title}
                </option>
              ))}
            </select>
            {errors.test_id && <p className="text-red-500 text-sm mt-2">{errors.test_id}</p>}

            {/* Test Preview */}
            {selectedTest && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-900">{selectedTest.title}</p>
                {selectedTest.description && <p className="text-sm text-purple-700 mt-1">{selectedTest.description}</p>}
              </div>
            )}
          </div>

          {/* Candidate Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin ứng viên</h3>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 text-gray-500" />
                Email ứng viên *
              </label>
              <input
                type="email"
                value={formData.candidate_email}
                onChange={(e) => setFormData({ ...formData, candidate_email: e.target.value })}
                placeholder="candidate@example.com"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                  errors.candidate_email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.candidate_email && <p className="text-red-500 text-sm mt-2">{errors.candidate_email}</p>}
            </div>

            {/* Name (Optional) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 text-gray-500" />
                Tên ứng viên (tùy chọn)
              </label>
              <input
                type="text"
                value={formData.candidate_fullname}
                onChange={(e) => setFormData({ ...formData, candidate_fullname: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/company/assignments" })}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createAssignment.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{createAssignment.isPending ? "Đang gửi..." : "Gửi bài test"}</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
