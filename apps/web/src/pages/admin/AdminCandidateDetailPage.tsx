import { useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
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
import api from "../../libs/api";
import { useDynamicTranslation } from "../../libs/translations";

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
  const { tContent } = useDynamicTranslation();
  const [result, setResult] = useState<MbtiResult | null>(null);
  const [candidate, setCandidate] = useState<CandidateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const detailRes = await api.get(`/admin/candidates/${assessmentId}/detail`);
        const data = detailRes.data;

        const apiResult = data.result ? { ...data.result, mbti_types: data.result.mbti_types } : null;
        setResult(apiResult);

        const assessment = data.assessment;
        let apiCandidate: CandidateInfo | null = null;

        if (assessment.guest_email) {
          apiCandidate = {
            id: assessment.id,
            email: assessment.guest_email,
            full_name: assessment.guest_fullname || tContent("Guest"),
            completed_at: assessment.completed_at || assessment.created_at,
          };
        } else if (assessment.users) {
          const user = assessment.users;
          apiCandidate = {
            id: assessment.id,
            email: user.email,
            full_name: user.full_name,
            completed_at: assessment.completed_at || assessment.created_at,
          };
        }

        setCandidate(apiCandidate);
        setLoading(false);
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [assessmentId]);

  const handleExportPDF = async () => {
    try {
      setExporting(true);
      const response = await api.get(`/admin/candidates/${assessmentId}/export-pdf`, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `assessment-result-${assessmentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
      alert("Không thể xuất PDF. Vui lòng thử lại.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{tContent("Loading candidate details...")}</div>
      </div>
    );
  }

  if (!result || !candidate) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{tContent("Result not found")}</div>
      </div>
    );
  }

  const mbtiRaw: MbtiTypeDetails = (result as any).mbti_types ?? (result as any).mbti_type_details ?? {};

  const mbti = {
    type_name: mbtiRaw.type_name ?? tContent("No data available"),
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
          <span>{tContent("Back to list")}</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? tContent("Exporting...") : tContent("Export PDF")}</span>
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
          {tContent("Overview")}
        </h2>
        <p className="text-gray-700 leading-relaxed">{mbti.overview}</p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-green-700">
            <CheckCircle className="w-5 h-5 mr-2" />
            {tContent("Strengths")}
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
            {tContent("Weaknesses")}
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
            {tContent("Communication Style")}
          </h2>
          <p className="text-gray-700 leading-relaxed">{mbti.communication_style}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 text-purple-600 mr-2" />
            {tContent("Leadership Style")}
          </h2>
          <p className="text-gray-700 leading-relaxed">{mbti.leadership_style}</p>
        </div>
      </div>

      {/* Career & Roles */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
            {tContent("Career Recommendations")}
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
            {tContent("Suitable Roles")}
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
          {tContent("Workplace Needs")}
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
    </div>
  );
}
