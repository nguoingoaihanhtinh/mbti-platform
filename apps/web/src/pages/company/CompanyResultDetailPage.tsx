// src/pages/company/CompanyResultDetailPage.tsx
import { useParams, useNavigate } from "@tanstack/react-router";
import { type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from "react";
import { useAssignmentDetail } from "../../hooks/useAssignments";
import { ArrowLeft, Mail, User, Calendar, Award, Users, Target, Briefcase, BarChart3 } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { AppShell } from "../../components/layout/AppShell";

export default function CompanyResultDetailPage() {
  const { id: assessmentId } = useParams({ from: "/company/results/$id" });
  // const search = useSearch({ from: "/company/results/$id" });
  const navigate = useNavigate();

  const { data, isLoading, error } = useAssignmentDetail(assessmentId);

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải kết quả...</div>
        </div>
      </AppShell>
    );
  }

  if (error || !data) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Không tìm thấy kết quả</div>
        </div>
      </AppShell>
    );
  }

  const { assessment, responses, test } = data;
  const mbtiType = assessment.results?.[0]?.mbti_types?.[0];
  const candidateName = assessment.guest_fullname || "Guest";
  const candidateEmail = assessment.guest_email;

  // Calculate dimension scores for radar chart
  const dimensionScores: Record<string, number> = {};
  responses.forEach((resp) => {
    const question = test?.questions?.find((q) => q.id === resp.question_id);
    if (question?.dimension) {
      dimensionScores[question.dimension] = (dimensionScores[question.dimension] || 0) + 1;
    }
  });
  const radarData = Object.entries(dimensionScores).map(([dimension, count]) => ({
    dimension,
    score: count,
  }));

  // Calculate answer letter counts for bar chart
  const answerCounts: Record<string, number> = {};
  responses.forEach((resp) => {
    const question = test?.questions?.find((q) => q.id === resp.question_id);
    const answer = question?.answers?.find((a) => a.id === resp.answer_id);
    if (answer) {
      const letter = answer.text.match(/^([A-Z])\./)?.[1] || answer.text[0];
      answerCounts[letter] = (answerCounts[letter] || 0) + 1;
    }
  });
  const barData = Object.entries(answerCounts).map(([letter, count]) => ({
    letter,
    count,
  }));

  const COLORS = ["#9333ea", "#ec4899", "#3b82f6", "#10b981"];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/company/assignments" })}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách
          </button>
        </div>

        {/* Candidate Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <User className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{candidateName}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{candidateEmail}</span>
                  </div>
                  {assessment.completed_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(assessment.completed_at).toLocaleDateString("vi-VN")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {mbtiType?.type_code || "—"}
              </div>
              <p className="text-gray-600 mt-1">{mbtiType?.type_name}</p>
            </div>
          </div>
        </div>

        {/* Overview */}
        {mbtiType?.overview && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Award className="w-5 h-5 text-purple-600 mr-2" />
              Tổng quan
            </h2>
            <p className="text-gray-700">{mbtiType.overview}</p>
          </div>
        )}

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Radar Chart - Dimensions */}
          {radarData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Target className="w-5 h-5 text-purple-600 mr-2" />
                Phân tích theo chiều
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" />
                  <Radar name="Điểm số" dataKey="score" stroke="#9333ea" fill="#9333ea" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Bar Chart - Answer Letters */}
          {barData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                Phân bố câu trả lời
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="letter" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {barData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid lg:grid-cols-2 gap-6">
          {mbtiType?.strengths && mbtiType.strengths.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 text-green-700">Điểm mạnh</h2>
              <ul className="space-y-2">
                {mbtiType.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600">✓</span> {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {mbtiType?.weaknesses && mbtiType.weaknesses.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4 text-orange-700">Điểm yếu</h2>
              <ul className="space-y-2">
                {mbtiType.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-orange-600">●</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Career & Roles */}
        {(mbtiType?.career_recommendations?.length || mbtiType?.suitable_roles?.length) && (
          <div className="grid lg:grid-cols-2 gap-6">
            {mbtiType.career_recommendations && mbtiType.career_recommendations.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                  Gợi ý nghề nghiệp
                </h2>
                <div className="flex flex-wrap gap-2">
                  {mbtiType.career_recommendations.map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {mbtiType.suitable_roles && mbtiType.suitable_roles.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  Vai trò phù hợp
                </h2>
                <div className="flex flex-wrap gap-2">
                  {mbtiType.suitable_roles.map(
                    (
                      r:
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactElement<unknown, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | Promise<
                            | string
                            | number
                            | bigint
                            | boolean
                            | ReactPortal
                            | ReactElement<unknown, string | JSXElementConstructor<any>>
                            | Iterable<ReactNode>
                            | null
                            | undefined
                          >
                        | null
                        | undefined,
                      i: Key | null | undefined
                    ) => (
                      <span key={i} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {r}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Detailed Responses */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Chi tiết câu trả lời</h2>
          <div className="space-y-4">
            {responses.map((resp, idx) => {
              const question = test?.questions?.find((q) => q.id === resp.question_id);
              const answerText = resp.free_text
                ? resp.free_text
                : question?.answers?.find((a) => a.id === resp.answer_id)?.text || "—";

              return (
                <div key={resp.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900 mb-1">
                    {idx + 1}. {question?.text || "—"}
                  </p>
                  <p className="text-gray-700 text-sm">{answerText}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
