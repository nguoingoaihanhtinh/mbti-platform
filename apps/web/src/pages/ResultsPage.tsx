import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/button";
import { BarChart3, TrendingUp, CheckCircle, AlertCircle, MessageSquare, Users, BookOpen } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";
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
  answers: { id: string; text: string }[];
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

  const limit = 5;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const resultRes = await api.get(`/assessments/${id}/result`);
        setResult(resultRes.data);

        const assessmentRes = await api.get(`/assessments/${id}`);
        const testId = assessmentRes.data.test_id;

        const testRes = await api.get(`/tests/${testId}`);
        const qMap: Record<string, QuestionWithAnswers> = {};
        for (const q of testRes.data.questions || []) {
          qMap[q.id] = {
            id: q.id,
            text: q.text,
            dimension: q.dimension,
            answers: q.answers.map((a: any) => ({
              id: a.id,
              text: a.text,
            })),
          };
        }
        setQuestionsMap(qMap);

        const allResp = await api.get(`/assessments/${id}/responses`, {
          params: { page: 1, limit: 1000 },
        });

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
            if (answer) {
              const match = answer.text.match(/^([A-Z])\./);
              const letter = match ? match[1] : answer.text[0];
              ansCount[letter] = (ansCount[letter] || 0) + 1;
            }
          }
        });

        setDimensionCounts(dimCount);
        setAnswerCounts(ansCount);

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  useEffect(() => {
    const fetchPageResponses = async () => {
      const resp = await api.get(`/assessments/${id}/responses`, {
        params: { page: currentPage, limit },
      });
      setResponses(resp.data.data || []);
      setTotalPages(resp.data.total_pages);
    };

    fetchPageResponses();
  }, [id, currentPage]);

  if (loading)
    return (
      <AppShell activeNav="assessments">
        <div className="p-6">Loading your result...</div>
      </AppShell>
    );

  if (!result)
    return (
      <AppShell activeNav="assessments">
        <div className="p-6 text-red-500">Result not found</div>
      </AppShell>
    );

  const mbti = result.mbti_type_details;

  const maxDim = Math.max(...Object.values(dimensionCounts), 1);

  const answerChartData = Object.entries(answerCounts).map(([key, value]) => ({
    answer: key,
    count: value,
  }));

  const COLORS = [
    "#d3c8f0", // secondary-300
    "#b8a8e1", // secondary-400
    "#9c88d2", // secondary-500
    "#7a67b3", // secondary-600
  ];

  return (
    <AppShell activeNav="assessments">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Your MBTI Result</h1>
        <p className="text-gray-500">A minimal and clean personality report</p>
      </div>

      {/* Result Card */}
      <div className="bg-white border rounded-xl shadow-sm p-8 mb-8 text-center">
        <div className="text-6xl font-bold text-primary-600">{result.mbti_type}</div>
        <p className="text-gray-600 mt-2">{mbti.type_name}</p>
        <p className="text-gray-700 mt-4 max-w-2xl mx-auto">{mbti.overview}</p>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-primary-600 mr-2" />
            Dimension Summary
          </h2>
          <div className="space-y-4">
            {Object.entries(dimensionCounts).map(([dim, count]) => (
              <div key={dim}>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>{dim}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div className="h-2 rounded-full bg-primary-600" style={{ width: `${(count / maxDim) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 text-primary-600 mr-2" />
            Answer Distribution
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={answerChartData}>
              <CartesianGrid stroke="#e5e7eb" />
              <XAxis dataKey="answer" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {answerChartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="border-t border-gray-200 my-8"></div>

      {/* Strengths / Weaknesses */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            Strengths
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            {mbti.strengths.map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
            Weaknesses
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            {mbti.weaknesses.map((w, i) => (
              <li key={i}>• {w}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 my-8"></div>

      {/* Work & Communication */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">Work & Communication Style</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <MessageSquare className="w-4 h-4 text-blue-500 mr-2" />
              Communication Style
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">{mbti.communication_style}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Users className="w-4 h-4 text-purple-500 mr-2" />
              Leadership Style
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">{mbti.leadership_style}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 my-8"></div>

      {/* Workplace Needs */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
          Workplace Needs
        </h2>
        <ul className="grid md:grid-cols-2 gap-2 text-gray-700 text-sm">
          {mbti.workplace_needs.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200 my-8"></div>

      {/* Career */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 text-blue-500 mr-2" />
            Career Recommendations
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            {mbti.career_recommendations.map((c, i) => (
              <li key={i}>• {c}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="w-5 h-5 text-green-500 mr-2" />
            Suitable Roles
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            {mbti.suitable_roles.map((r, i) => (
              <li key={i}>• {r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 my-8"></div>
      <div className="bg-white pt-5 pl-5 border border-gray-200 rounded-lg shadow-sm mb-5">
        {/* Responses */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Your Answers</h2>
          <ul className="space-y-4 text-sm">
            {responses.map((resp) => {
              const q = questionsMap[resp.question_id];
              const answerText = resp.free_text
                ? resp.free_text
                : q?.answers.find((a) => a.id === resp.answer_id)?.text;
              return (
                <li key={resp.id} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="text-gray-800">
                    <span className="font-medium">Q:</span> {q?.text}
                  </div>
                  <div className="text-gray-800">
                    <span className="font-medium">A:</span> {answerText || "—"}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <Button variant="ghost" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                ‹ Previous
              </Button>
              <span className="px-3 text-gray-600 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next ›
              </Button>
            </div>
          )}
        </div>
      </div>

      <Button variant="primary" onClick={() => window.history.back()}>
        Back to Assessments
      </Button>
    </AppShell>
  );
}
