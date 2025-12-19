// src/routes/guest/results.$assessmentId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "../../libs/api";
import { BarChart3, CheckCircle, AlertCircle, MessageSquare, Award, Target, Briefcase } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

export const Route = createFileRoute("/guest/results/$assessmentId")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) ?? "",
    };
  },
  component: GuestResultPage,
});

// Types
type ResponseItem = {
  id: string;
  question_id: string;
  answer_id: string | null;
  free_text: string | null;
};

type Question = {
  id: string;
  text: string;
  dimension: string | null;
  answers: { id: string; text: string }[];
};

type MbtiTypeDetails = {
  type_code: string;
  type_name: string;
  overview: string;
  strengths: string[];
  weaknesses: string[];
  career_recommendations: string[];
  communication_style: string;
  leadership_style: string;
  workplace_needs: string[];
  suitable_roles: string[];
};

type GuestResultData = {
  id: string;
  mbti_type: string;
  mbti_type_details: MbtiTypeDetails;
  assessment_id: string;
};

function GuestResultPage() {
  const { assessmentId } = Route.useParams();
  const { email } = Route.useSearch();

  const {
    data: result,
    isLoading: isLoadingResult,
    error: resultError,
  } = useQuery({
    queryKey: ["guest-result", assessmentId, email],
    queryFn: async () => {
      if (!email) throw new Error("Email required");
      const { data } = await api.get<GuestResultData>(`/assessments/${assessmentId}/guest-result`, {
        params: { email },
      });
      return data;
    },
    enabled: !!assessmentId && !!email,
  });

  const { data: responses, isLoading: isLoadingResponses } = useQuery({
    queryKey: ["guest-responses", assessmentId],
    queryFn: async () => {
      const { data } = await api.get<{ data: ResponseItem[] }>("/assessments/" + assessmentId + "/responses");
      return data.data || [];
    },
    enabled: !!assessmentId,
  });

  const { data: test, isLoading: isLoadingTest } = useQuery({
    queryKey: ["guest-test", assessmentId],
    queryFn: async () => {
      const assessmentRes = await api.get(`/assessments/${assessmentId}`);
      const testId = assessmentRes.data.test_id;

      const testRes = await api.get(`/tests/${testId}`);
      return testRes.data;
    },
    enabled: !!assessmentId,
  });

  const isLoading = isLoadingResult || isLoadingResponses || isLoadingTest;
  if (isLoading) return <div className="p-8">Đang tải kết quả...</div>;
  if (resultError) return <div className="p-8 text-red-600">Lỗi khi tải kết quả</div>;
  if (!result) return <div className="p-8">Không tìm thấy kết quả</div>;

  const questionsMap: Record<string, Question> = {};
  if (test?.questions) {
    for (const q of test.questions) {
      questionsMap[q.id] = {
        id: q.id,
        text: q.text,
        dimension: q.dimension,
        answers: q.answers,
      };
    }
  }

  const dimensionCounts: Record<string, number> = {};
  const answerCounts: Record<string, number> = {};

  responses?.forEach((resp) => {
    const question = questionsMap[resp.question_id];
    if (question?.dimension) {
      dimensionCounts[question.dimension] = (dimensionCounts[question.dimension] || 0) + 1;
    }
    if (resp.answer_id) {
      const answer = question?.answers.find((a) => a.id === resp.answer_id);
      if (answer) {
        const match = answer.text.match(/^([A-Z])\./);
        const letter = match ? match[1] : answer.text[0];
        answerCounts[letter] = (answerCounts[letter] || 0) + 1;
      }
    }
  });

  const maxDim = Math.max(...Object.values(dimensionCounts), 1);
  const radarData = Object.entries(dimensionCounts).map(([dimension, count]) => ({
    dimension,
    score: (count / maxDim) * 100,
  }));

  const answerChartData = Object.entries(answerCounts).map(([letter, count]) => ({
    answer: letter,
    count,
  }));

  const COLORS = ["#9333ea", "#ec4899", "#3b82f6", "#f59e0b"];
  const mbti = result.mbti_type_details;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kết quả MBTI của bạn</h1>
        <div className="mt-4 inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full text-4xl font-bold">
          {result.mbti_type}
        </div>
        <p className="mt-2 text-gray-600">{mbti?.type_name || "—"}</p>
      </div>

      {/* Overview */}
      {mbti?.overview && (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Award className="w-5 h-5 text-purple-600 mr-2" />
            Tổng quan
          </h2>
          <p className="text-gray-700">{mbti.overview}</p>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {radarData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 text-purple-600 mr-2" />
              Phân tích theo chiều
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="dimension" />
                  <Radar name="Điểm số" dataKey="score" stroke="#9333ea" fill="#9333ea" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {answerChartData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
              Phân bố câu trả lời
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={answerChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="answer" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {answerChartData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {mbti?.strengths && mbti.strengths.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              Điểm mạnh
            </h2>
            <ul className="space-y-3">
              {mbti.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-xs font-bold">✓</span>
                  </div>
                  <span className="text-gray-700">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {mbti?.weaknesses && mbti.weaknesses.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-orange-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              Điểm yếu
            </h2>
            <ul className="space-y-3">
              {mbti.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-600 text-xs font-bold">!</span>
                  </div>
                  <span className="text-gray-700">{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Career & Communication */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {mbti?.career_recommendations && mbti.career_recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
              Gợi ý nghề nghiệp
            </h2>
            <div className="flex flex-wrap gap-2">
              {mbti.career_recommendations.map((c, i) => (
                <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {mbti?.communication_style && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
              Phong cách giao tiếp
            </h2>
            <p className="text-gray-700">{mbti.communication_style}</p>
          </div>
        )}
      </div>

      {/* Responses */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">Chi tiết câu trả lời</h2>
        <div className="space-y-4">
          {responses?.map((resp, idx) => {
            const q = questionsMap[resp.question_id];
            const answerText = resp.free_text
              ? resp.free_text
              : q?.answers.find((a) => a.id === resp.answer_id)?.text || "—";

            return (
              <div key={resp.id} className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 text-sm font-semibold">{idx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium mb-2">{q?.text}</p>
                    <p className="text-gray-700 text-sm">{answerText}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
