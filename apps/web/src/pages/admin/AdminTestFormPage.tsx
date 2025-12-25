import { useState, useEffect } from "react";
import { useMatch, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../libs/api";
import { ArrowLeft, Save, Plus, Trash2, FileText, CheckCircle, AlertCircle, GripVertical } from "lucide-react";
import { useDynamicTranslation } from "../../libs/translations";
interface Answer {
  id?: string;
  text: string;
  score: number;
  dimension?: string | null;
  order_index: number;
}

interface Question {
  id?: string;
  text: string;
  type?: string | null;
  dimension?: string | null;
  order_index: number;
  answers: Answer[];
}

interface TestFormData {
  title: string;
  description?: string | null;
  is_active?: boolean;
  questions: Question[];
  version: {
    version_number: number;
    description?: string | null;
  };
}

export default function AdminTestFormPage() {
  const navigate = useNavigate();
  const { tContent } = useDynamicTranslation();
  const editMatch = useMatch({ from: "/admin/tests/$testId", shouldThrow: false });

  const isEdit = !!editMatch;
  const testId = editMatch?.params.testId;

  const [formData, setFormData] = useState<TestFormData>({
    title: "",
    description: null,
    is_active: true,
    questions: [],
    version: {
      version_number: 1,
      description: null,
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const { data: testData, isLoading: loadingTest } = useQuery({
    queryKey: ["test", testId],
    queryFn: async () => {
      const { data } = await api.get(`/tests/${testId}`);
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (testData && isEdit) {
      setFormData({
        title: testData.test?.title || "",
        description: testData.test?.description || null,
        is_active: testData.test?.is_active ?? true,
        questions: (testData.questions || []).map((q: any, idx: number) => ({
          ...q,
          order_index: q.order_index ?? idx + 1,
          answers: (q.answers || []).map((a: any, aIdx: number) => ({
            ...a,
            order_index: a.order_index ?? aIdx + 1,
            score: a.score ?? 0,
          })),
        })),
        version: testData.version || { version_number: 1, description: null },
      });
    }
  }, [testData, isEdit]);

  const saveMutation = useMutation({
    mutationFn: async (data: TestFormData) => {
      if (isEdit) {
        const response = await api.put(`/tests/${testId}`, data);
        return response.data;
      } else {
        const response = await api.post("/tests", data);
        return response.data;
      }
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/admin/tests" });
      }, 1500);
    },
    onError: (error: any) => {
      setErrors({
        submit:
          error.response?.data?.message ||
          tContent("Error saving test").replace("{action}", isEdit ? "cập nhật" : "tạo"),
      });
    },
  });

  const handleAddQuestion = () => {
    const newOrderIndex = formData.questions.length + 1;
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          text: "",
          type: "single_choice",
          dimension: null,
          order_index: newOrderIndex,
          answers: [
            { text: "", score: 0, dimension: null, order_index: 1 },
            { text: "", score: 0, dimension: null, order_index: 2 },
          ],
        },
      ],
    });
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = formData.questions.filter((_, i) => i !== index);

    const reorderedQuestions = newQuestions.map((q, idx) => ({
      ...q,
      order_index: idx + 1,
    }));
    setFormData({ ...formData, questions: reorderedQuestions });
  };

  const handleQuestionChange = (index: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    (newQuestions[index] as any)[field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleAddAnswer = (questionIndex: number) => {
    const newQuestions = [...formData.questions];
    const newOrderIndex = newQuestions[questionIndex].answers.length + 1;
    newQuestions[questionIndex].answers.push({
      text: "",
      score: 0,
      dimension: null,
      order_index: newOrderIndex,
    });
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleRemoveAnswer = (questionIndex: number, answerIndex: number) => {
    const newQuestions = [...formData.questions];
    newQuestions[questionIndex].answers = newQuestions[questionIndex].answers
      .filter((_, i) => i !== answerIndex)
      .map((a, idx) => ({ ...a, order_index: idx + 1 }));
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleAnswerChange = (questionIndex: number, answerIndex: number, field: string, value: any) => {
    const newQuestions = [...formData.questions];
    (newQuestions[questionIndex].answers[answerIndex] as any)[field] = value;
    setFormData({ ...formData, questions: newQuestions });
  };

  const handleSubmit = async () => {
    setErrors({});

    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = tContent("Please enter the test title");
    }

    if (formData.questions.length === 0) {
      newErrors.questions = tContent("Please add at least one question");
    }

    formData.questions.forEach((q, i) => {
      if (!q.text?.trim()) {
        newErrors[`question_${i}`] = tContent("Question cannot be empty");
      }
      if (q.answers.length < 2) {
        newErrors[`question_${i}_answers`] = tContent("At least 2 answers are required");
      }

      q.answers.forEach((a, j) => {
        if (!a.text?.trim()) {
          newErrors[`question_${i}_answer_${j}`] = tContent("Answer cannot be empty");
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
        <div className="text-gray-500">{tContent("Loading...")}</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/admin/tests" })}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{tContent("Go Back")}</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? tContent("Edit Test") : tContent("Create New Test")}
        </h1>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-green-900 font-medium">
              {isEdit ? tContent("Update") : tContent("Create")} {tContent("test")} {tContent("successful")}!
            </p>
            <p className="text-green-700 text-sm mt-1">{tContent("Redirecting...")}</p>
          </div>
        </div>
      )}

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-900 font-medium">{tContent("An error occurred")}</p>
            <p className="text-red-700 text-sm mt-1">{errors.submit}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{tContent("Basic Information")}</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {tContent("Test Title")} <span className="text-red-500">*</span>
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Description")}</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                placeholder={tContent("Description about the test...")}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-600"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                {tContent("Activate")} {tContent("test")}
              </label>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {tContent("Questions")} ({formData.questions.length})
            </h2>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{tContent("Add Question")}</span>
            </button>
          </div>

          {errors.questions && <p className="text-red-500 text-sm mb-4">{errors.questions}</p>}

          <div className="space-y-6">
            {formData.questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="p-5 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-900">
                        {tContent("Question")} {qIndex + 1}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIndex)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {tContent("Question Text")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={question.text}
                      onChange={(e) => handleQuestionChange(qIndex, "text", e.target.value)}
                      placeholder="Nhập nội dung câu hỏi..."
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                        errors[`question_${qIndex}`] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[`question_${qIndex}`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`question_${qIndex}`]}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">{tContent("Question Type")}</label>
                      <select
                        value={question.type || "single_choice"}
                        onChange={(e) => handleQuestionChange(qIndex, "type", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      >
                        <option value="single_choice">{tContent("Choose 1 answer")}</option>
                        <option value="multiple_choice">{tContent("Choose multiple answers")}</option>
                        <option value="scale">{tContent("Scale")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        {tContent("Dimension (E/I, S/N, T/F, J/P)")}
                      </label>
                      <input
                        type="text"
                        value={question.dimension || ""}
                        onChange={(e) => handleQuestionChange(qIndex, "dimension", e.target.value || null)}
                        placeholder={tContent("Example: E/I")}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>

                  {/* Answers */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        {tContent("Answers")} <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAddAnswer(qIndex)}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        + {tContent("Add Answer")}
                      </button>
                    </div>

                    <div className="space-y-2">
                      {question.answers.map((answer, aIndex) => (
                        <div key={aIndex} className="flex items-start gap-2">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={answer.text}
                              onChange={(e) => handleAnswerChange(qIndex, aIndex, "text", e.target.value)}
                              placeholder={`${tContent("Answer")} ${aIndex + 1}`}
                              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${
                                errors[`question_${qIndex}_answer_${aIndex}`] ? "border-red-500" : "border-gray-300"
                              }`}
                            />
                            {errors[`question_${qIndex}_answer_${aIndex}`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`question_${qIndex}_answer_${aIndex}`]}
                              </p>
                            )}
                          </div>
                          <input
                            type="number"
                            value={answer.score}
                            onChange={(e) => handleAnswerChange(qIndex, aIndex, "score", parseInt(e.target.value) || 0)}
                            placeholder={tContent("Score")}
                            title={tContent("Score of the answer")}
                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                          />
                          {question.answers.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                              title={tContent("Delete Answer")}
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

            {formData.questions.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">{tContent("No questions yet")}</p>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{tContent("Add the first question")}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 sticky bottom-0 bg-white p-4 border-t border-gray-200 -mx-6 -mb-6 rounded-b-xl">
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/tests" })}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            <span>
              {saveMutation.isPending
                ? tContent("Saving...")
                : isEdit
                  ? tContent("Update Test")
                  : tContent("Create Test")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
