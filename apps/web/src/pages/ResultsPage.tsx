import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/button";
import {
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Users,
  BookOpen,
  Award,
  Briefcase,
  Target,
} from "lucide-react";
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
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import api from "../libs/api";

type ResponseItem = {
  id: string;
  question_id: string;
  answer_id: string | null;
  free_text: string | null;
};

type QuestionWithAnswers = {
  id: string;
  text: string;
  dimension?: string;
  answers: { id: string; text: string; order_index: number }[];
};

type MbtiTypeDetails = {
  id: string;
  type_code: string;
  type_name: string;
  overview: string;
  strengths: string[];
  weaknesses: string[];
  improvement_areas: string[];
  career_recommendations: string[];
  workplace_needs: string[];
  suitable_roles: string[];
  communication_style: string;
  leadership_style: string;
};

type MbtiResult = {
  id: string;
  assessment_id: string;
  mbti_type: string;
  mbti_type_id: string;
  mbti_type_details: MbtiTypeDetails;
  raw_scores: Record<string, any>;
  created_at: string;
  updated_at: string;
};

// Normalize dimension format (E/I, S/N, T/F, J/P)
const normalizeDimension = (dim: string): string => {
  if (!dim) return "";
  const normalized = dim.replace("-", "/").toUpperCase();
  const validDimensions = ["E/I", "I/E", "S/N", "N/S", "T/F", "F/T", "J/P", "P/J"];

  if (validDimensions.includes(normalized)) {
    // Standardize order
    if (normalized === "I/E") return "E/I";
    if (normalized === "N/S") return "S/N";
    if (normalized === "F/T") return "T/F";
    if (normalized === "P/J") return "J/P";
    return normalized;
  }

  return normalized;
};

export default function ResultsPage() {
  const { id } = useParams({ from: "/results/$id" });

  const [result, setResult] = useState<MbtiResult | null>(null);
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [questionsMap, setQuestionsMap] = useState<Record<string, QuestionWithAnswers>>({});
  const [dimensionCounts, setDimensionCounts] = useState<Record<string, number>>({});
  const [answerCounts, setAnswerCounts] = useState<Record<string, number>>({});
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 10;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");

        let resultRes, assessmentRes, testRes, allResp;

        if (email) {
          resultRes = await api.get(`/assessments/${id}/guest-result`, { params: { email } });
          assessmentRes = await api.get(`/assessments/${id}/guest`, { params: { email } });
          allResp = await api.get(`/assessments/${id}/guest-responses`, {
            params: { email, page: 1, limit: 1000 },
          });
        } else {
          resultRes = await api.get(`/assessments/${id}/result`);
          assessmentRes = await api.get(`/assessments/${id}`);
          allResp = await api.get(`/assessments/${id}/responses`, {
            params: { page: 1, limit: 1000 },
          });
        }

        setResult(resultRes.data);

        const testId = assessmentRes.data.test_id;
        testRes = await api.get(`/tests/${testId}`);
        const qMap: Record<string, QuestionWithAnswers> = {};
        for (const q of testRes.data.questions || []) {
          qMap[q.id] = {
            id: q.id,
            text: q.text,
            dimension: normalizeDimension(q.dimension),
            answers: q.answers.map((a: any) => ({
              id: a.id,
              text: a.text,
              order_index: a.order_index,
            })),
          };
        }
        setQuestionsMap(qMap);

        const allResponses = allResp.data.data || [];
        const dimCount: Record<string, number> = {};
        const ansCount: Record<string, number> = {};

        allResponses.forEach((resp: ResponseItem) => {
          const question = qMap[resp.question_id];
          if (question?.dimension) {
            dimCount[question.dimension] = (dimCount[question.dimension] || 0) + 1;
          }
          if (resp.answer_id) {
            const answer = question?.answers.find((a) => a.id === resp.answer_id);
            if (answer && typeof answer.order_index === "number") {
              const letter = String.fromCharCode(65 + (answer.order_index - 1));
              ansCount[letter] = (ansCount[letter] || 0) + 1;
            }
          }
        });

        setDimensionCounts(dimCount);
        setAnswerCounts(ansCount);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load result:", err);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  useEffect(() => {
    const fetchPageResponses = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get("email");

        let resp;
        if (email) {
          resp = await api.get(`/assessments/${id}/guest-responses`, {
            params: { email, page: currentPage, limit },
          });
        } else {
          resp = await api.get(`/assessments/${id}/responses`, {
            params: { page: currentPage, limit },
          });
        }

        setResponses(resp.data.data || []);
        setTotalPages(resp.data.total_pages || 1);
      } catch (err) {
        console.error("Failed to fetch page responses:", err);
        setResponses([]);
        setTotalPages(1);
      }
    };

    fetchPageResponses();
  }, [id, currentPage]);

  if (loading)
    return (
      <AppShell activeNav="assessments">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Đang tải kết quả của bạn...</div>
        </div>
      </AppShell>
    );

  if (!result)
    return (
      <AppShell activeNav="assessments">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Không tìm thấy kết quả</div>
        </div>
      </AppShell>
    );

  const mbti = result.mbti_type_details;
  const maxDim = Math.max(...Object.values(dimensionCounts), 1);

  const answerChartData = Object.entries(answerCounts).map(([key, value]) => ({
    answer: key,
    count: value,
  }));

  const radarData = Object.entries(dimensionCounts).map(([dimension, count]) => ({
    dimension,
    score: (count / maxDim) * 100,
  }));

  const COLORS = ["#9333ea", "#ec4899", "#3b82f6", "#10b981"];

  return (
    <AppShell activeNav="assessments">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Kết quả MBTI của bạn</h1>
          <p className="text-gray-600">Báo cáo tính cách chi tiết và chuyên nghiệp</p>
        </div>

        {/* Result Card */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl shadow-lg p-8 text-center">
          <div className="text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            {result.mbti_type}
          </div>
          <p className="text-2xl font-semibold text-gray-800 mb-4">{mbti.type_name}</p>
          <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">{mbti.overview}</p>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-purple-600 mr-2" />
              Phân tích theo chiều
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Radar name="Điểm số" dataKey="score" stroke="#9333ea" fill="#9333ea" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
              Phân bố câu trả lời
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={answerChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="answer" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {answerChartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
        </div>

        {/* Communication & Leadership */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
              Phong cách giao tiếp
            </h2>
            <p className="text-gray-700 leading-relaxed">{mbti.communication_style}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 text-purple-600 mr-2" />
              Phong cách lãnh đạo
            </h2>
            <p className="text-gray-700 leading-relaxed">{mbti.leadership_style}</p>
          </div>
        </div>

        {/* Career & Roles */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 text-green-600 mr-2" />
              Vai trò phù hợp
            </h2>
            <div className="flex flex-wrap gap-2">
              {mbti.suitable_roles.map((r, i) => (
                <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Workplace Needs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
            Nhu cầu môi trường làm việc
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {mbti.workplace_needs.map((n, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-purple-600 text-xs">●</span>
                </div>
                <span className="text-gray-700">{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Responses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Award className="w-5 h-5 text-purple-600 mr-2" />
            Chi tiết câu trả lời của bạn
          </h2>
          <div className="space-y-4">
            {responses.map((resp, index) => {
              const q = questionsMap[resp.question_id];
              const answerText = resp.free_text
                ? resp.free_text
                : q?.answers.find((a) => a.id === resp.answer_id)?.text;
              return (
                <div key={resp.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-sm font-semibold">
                        {(currentPage - 1) * limit + index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">{q?.text}</p>
                      <p className="text-gray-700 text-sm">{answerText || "—"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="ghost"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                ← Trang trước
              </Button>
              <span className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                variant="ghost"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Trang sau →
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <Button variant="primary" onClick={() => window.history.back()}>
            Quay lại Danh sách
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
