import React, { useState, useEffect } from "react";

import { useNavigate } from "@tanstack/react-router";
import { Route as TestRoute } from "../../routes/admin/tests/$testId";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../libs/api";
import { ArrowLeft, Save, Plus, Trash2, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface Question {
  id?: string;
  text: string;
  dimension?: string;
  answers: {
    id?: string;
    text: string;
    score?: number;
  }[];
}

interface TestFormData {
  title: string;
  description?: string;
  questions: Question[];
}

export default function AdminTestFormPage() {
  const navigate = useNavigate();
  const { testId } = TestRoute.useParams();
  const isEdit = !!testId;

  const [formData, setFormData] = useState<TestFormData>({
    title: "",
    description: "",
    questions: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  // Fetch test data if editing
  const { data: testData, isLoading: loadingTest } = useQuery({
    queryKey: ["admin", "test", testId],
    queryFn: async () => {
      const { data } = await api.get(`/admin/tests/${testId}`);
      return data;
    },
    enabled: isEdit,
  });

  // Populate form when data loads
  useEffect(() => {
    if (testData && isEdit) {
      setFormData({
        title: testData.title || "",
        description: testData.description || "",
        questions: testData.questions || [],
      });
    }
  }, [testData, isEdit]);

  const saveMutation = useMutation({
    mutationFn: async (data: TestFormData) => {
      if (isEdit) {
        const response = await api.put(`/admin/tests/${testId}`, data);
        return response.data;
      } else {
        const response = await api.post("/admin/tests", data);
        return response.data;
      }
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/admin/tests" });
      }, 2000);
    },
    onError: (error: any) => {
      setErrors({
        submit: error.response?.data?.message || `Có lỗi xảy ra khi ${isEdit ? "cập nhật" : "tạo"} test`,
      });
    },
  });

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: "",
          dimension: "",
          answers: [{ text: "" }, { text: "" }],
        },
      ],
    });
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const newQuestions = [...formData.questions];
    (newQuestions[index] as any)[field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleAddAnswer = (questionIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].answers.push({ text: "" });
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleRemoveAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers.filter((_, i) => i !== answerIndex);
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].answers[answerIndex].text = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title) {
      newErrors.title = "Vui lòng nhập tiêu đề test";
    }
    if (formData.questions.length === 0) {
      newErrors.questions = "Vui lòng thêm ít nhất 1 câu hỏi";
    }

    // Validate questions
    formData.questions.forEach((q, i) => {
      if (!q.text) {
        newErrors[`question_${i}`] = "Câu hỏi không được để trống";
      }
      if (q.answers.length < 2) {
        newErrors[`question_${i}_answers`] = "Cần ít nhất 2 câu trả lời";
      }
      q.answers.forEach((a, j) => {
        if (!a.text) {
          newErrors[`question_${i}_answer_${j}`] = "Câu trả lời không được để trống";
        }
      });
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    saveMutation.mutate(formData);
  };

  if (isEdit && loadingTest) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/admin/tests" })}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? "Chỉnh sửa Test" : "Tạo Test Mới"}</h1>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-900 font-medium">{isEdit ? "Cập nhật" : "Tạo"} test thành công!</p>
            <p className="text-green-700 text-sm mt-1">Đang chuyển hướng...</p>
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin cơ bản</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề test *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="MBTI Personality Assessment"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.title && <p className="text-red-500 text-sm mt-2">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả (tùy chọn)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về test..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Câu hỏi ({formData.questions.length})</h2>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu hỏi</span>
            </button>
          </div>

          {errors.questions && <p className="text-red-500 text-sm mb-4">{errors.questions}</p>}

          <div className="space-y-6">
            {formData.questions.map((question, qIndex) => (
              <div key={qIndex} className="p-4 border-2 border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Câu hỏi {qIndex + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIndex)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                      placeholder="Nội dung câu hỏi..."
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                        errors[`question_${qIndex}`] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[`question_${qIndex}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`question_${qIndex}`]}</p>
                    )}
                  </div>

                  {/* Dimension */}
                  <div>
                    <input
                      type="text"
                      value={question.dimension || ""}
                      onChange={(e) => handleQuestionChange(qIndex, "dimension", e.target.value)}
                      placeholder="Dimension (E-I, S-N, T-F, J-P)..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  {/* Answers */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Câu trả lời</label>
                      <button
                        type="button"
                        onClick={() => handleAddAnswer(qIndex)}
                        className="text-sm text-purple-600 hover:text-purple-700"
                      >
                        + Thêm câu trả lời
                      </button>
                    </div>

                    <div className="space-y-2">
                      {question.answers.map((answer, aIndex) => (
                        <div key={aIndex} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={answer.text}
                            onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                            placeholder={`Câu trả lời ${aIndex + 1}...`}
                            className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                              errors[`question_${qIndex}_answer_${aIndex}`] ? "border-red-500" : "border-gray-300"
                            }`}
                          />
                          {question.answers.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {errors[`question_${qIndex}_answers`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`question_${qIndex}_answers`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/tests" })}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>{saveMutation.isPending ? "Đang lưu..." : isEdit ? "Cập nhật" : "Tạo test"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
