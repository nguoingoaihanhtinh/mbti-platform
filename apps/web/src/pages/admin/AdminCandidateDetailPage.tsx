import { useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import {
  // BarChart3,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Users,
  BookOpen,
  Download,
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  Award,
  Target,
  Briefcase,
} from "lucide-react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Cell,
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Radar,
//   Legend,
// } from "recharts";
import api from "../../libs/api";

// type ResponseItem = {
//   id: string;
//   question_id: string;
//   answer_id: string | null;
//   free_text: string | null;
// };

type QuestionWithAnswers = {
  id: string;
  text: string;
  dimension?: string;
  answers: { id: string; text: string }[];
};

type MbtiTypeDetails = {
  id?: string;
  type_code?: string;
  type_name?: string;
  overview?: string;
  strengths?: string[];
  weaknesses?: string[];
  improvement_areas?: string[];
  career_recommendations?: string[];
  workplace_needs?: string[];
  suitable_roles?: string[];
  communication_style?: string;
  leadership_style?: string;
};

type MbtiResult = {
  id: string;
  assessment_id?: string;
  mbti_type?: string;
  mbti_type_id?: string;
  mbti_types?: MbtiTypeDetails;
  mbti_type_details?: MbtiTypeDetails;
  raw_scores?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
};

type CandidateInfo = {
  id: string;
  email: string;
  full_name: string;
  completed_at: string;
};

export default function AdminCandidateDetailPage() {
  const { assessmentId } = useParams({ from: "/admin/candidates/$assessmentId" });
  const navigate = useNavigate();

  const [result, setResult] = useState<MbtiResult | null>(null);
  const [candidate, setCandidate] = useState<CandidateInfo | null>(null);
  // const [responses, setResponses] = useState<ResponseItem[]>([]);
  // const [questionsMap, setQuestionsMap] = useState<Record<string, QuestionWithAnswers>>({});
  // const [dimensionCounts, setDimensionCounts] = useState<Record<string, number>>({});
  // const [answerCounts, setAnswerCounts] = useState<Record<string, number>>({});
  // const [totalPages, setTotalPages] = useState(1);
  // const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const limit = 10;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const detailRes = await api.get(`/admin/candidates/${assessmentId}/detail`);
        const data = detailRes.data;

        // Process result
        const apiResult = data.result ? { ...data.result, mbti_types: data.result.mbti_types } : null;
        setResult(apiResult);

        // Process candidate
        const assessment = data.assessment;
        let apiCandidate: CandidateInfo | null = null;

        if (assessment.guest_email) {
          // Guest candidate
          apiCandidate = {
            id: assessment.id,
            email: assessment.guest_email,
            full_name: assessment.guest_fullname || "Guest",
            completed_at: assessment.completed_at || assessment.created_at,
          };
        } else if (assessment.users) {
          // Registered user (users is OBJECT)
          const user = assessment.users;
          apiCandidate = {
            id: assessment.id,
            email: user.email,
            full_name: user.full_name,
            completed_at: assessment.completed_at || assessment.created_at,
          };
        }

        setCandidate(apiCandidate);

        // Process questions
        const qMap: Record<string, QuestionWithAnswers> = {};
        if (data.test?.questions) {
          for (const q of data.test.questions as Array<{
            id: string;
            text: string;
            dimension: string | null;
            answers: Array<{ id: string; text: string }>;
          }>) {
            qMap[q.id] = {
              id: q.id,
              text: q.text,
              dimension: q.dimension || undefined,
              answers: q.answers.map((a) => ({
                id: a.id,
                text: a.text,
              })),
            };
          }
        }
        // setQuestionsMap(qMap);

        // // Process responses
        // const allResponses = data.responses || [];
        // setResponses(allResponses);
        // setTotalPages(Math.ceil(allResponses.length / limit));

        // Calculate stats
        // const dimCount: Record<string, number> = {};
        // const ansCount: Record<string, number> = {};

        // allResponses.forEach((resp: ResponseItem) => {
        //   const question = qMap[resp.question_id];
        //   if (question?.dimension) {
        //     dimCount[question.dimension] = (dimCount[question.dimension] || 0) + 1;
        //   }
        //   if (resp.answer_id) {
        //     const answer = question?.answers.find((a) => a.id === resp.answer_id);
        //     if (answer) {
        //       const match = answer.text.match(/^([A-Z])\./);
        //       const letter = match ? match[1] : answer.text[0];
        //       ansCount[letter] = (ansCount[letter] || 0) + 1;
        //     }
        //   }
        // });

        // setDimensionCounts(dimCount);
        // setAnswerCounts(ansCount);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [assessmentId, limit]);

  const handleExportPDF = () => {
    alert("Tính năng xuất PDF đang được phát triển");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải chi tiết ứng viên...</div>
      </div>
    );
  }
  console.log("Result:", result);
  console.log("Candidate:", candidate);
  if (!result || !candidate) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Không tìm thấy kết quả</div>
      </div>
    );
  }

  const mbtiRaw: MbtiTypeDetails = (result as any).mbti_types ?? (result as any).mbti_type_details ?? {};

  const mbti = {
    type_name: mbtiRaw.type_name ?? "Không có dữ liệu",
    overview: mbtiRaw.overview ?? "—",
    strengths: Array.isArray(mbtiRaw.strengths) ? mbtiRaw.strengths : [],
    weaknesses: Array.isArray(mbtiRaw.weaknesses) ? mbtiRaw.weaknesses : [],
    improvement_areas: Array.isArray(mbtiRaw.improvement_areas) ? mbtiRaw.improvement_areas : [],
    career_recommendations: Array.isArray(mbtiRaw.career_recommendations) ? mbtiRaw.career_recommendations : [],
    workplace_needs: Array.isArray(mbtiRaw.workplace_needs) ? mbtiRaw.workplace_needs : [],
    suitable_roles: Array.isArray(mbtiRaw.suitable_roles) ? mbtiRaw.suitable_roles : [],
    communication_style: mbtiRaw.communication_style ?? "—",
    leadership_style: mbtiRaw.leadership_style ?? "—",
  };

  // const maxDim = Math.max(...Object.values(dimensionCounts), 1);
  // const answerChartData = Object.entries(answerCounts).map(([key, value]) => ({
  //   answer: key,
  //   count: value,
  // }));
  // const radarData = Object.entries(dimensionCounts).map(([dimension, count]) => ({
  //   dimension,
  //   score: (count / maxDim) * 100,
  // }));
  // const COLORS = ["#9333ea", "#ec4899", "#3b82f6", "#f59e0b"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            navigate({
              to: "/admin/candidates",
              search: { page: 1 },
            })
          }
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại danh sách</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* Candidate Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{candidate.full_name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(candidate.completed_at).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(candidate.completed_at).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {result.mbti_type ?? "—"}
            </div>
            <p className="text-gray-600 mt-1">{mbti.type_name}</p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Award className="w-5 h-5 text-purple-600 mr-2" />
          Tổng quan
        </h2>
        <p className="text-gray-700 leading-relaxed">{mbti.overview}</p>
      </div>

      {/* Charts Section */}
      {/* <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 text-purple-600 mr-2" />
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
      </div> */}

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

      {/* Responses Section */}
      {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6">Chi tiết câu trả lời</h2>
        <div className="space-y-4">
          {responses.slice((currentPage - 1) * limit, currentPage * limit).map((resp, index) => {
            const q = questionsMap[resp.question_id];
            const answerText = resp.free_text ? resp.free_text : q?.answers.find((a) => a.id === resp.answer_id)?.text;
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Trang trước
            </button>
            <span className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trang sau →
            </button>
          </div>
        )}
      </div> */}
    </div>
  );
}
