import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/button";
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
  answers: { id: string; text: string }[];
};

export default function ResultsPage() {
  const { id } = useParams({ from: "/results/$id" });

  const [result, setResult] = useState<{ mbti_type: string } | null>(null);
  const [responses, setResponses] = useState<ResponseItem[]>([]);
  const [questionsMap, setQuestionsMap] = useState<Record<string, QuestionWithAnswers>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Result data
        const resultRes = await api.get(`/assessments/${id}/result`);
        setResult(resultRes.data);

        // 2. Assessment → test_id
        const assessmentRes = await api.get(`/assessments/${id}`);
        const testId = assessmentRes.data.test_id;

        // 3. Full test (questions + answers with text)
        const testRes = await api.get(`/tests/${testId}`);
        const questions = testRes.data.questions || [];
        const qMap: Record<string, QuestionWithAnswers> = {};
        for (const q of questions) {
          qMap[q.id] = {
            id: q.id,
            text: q.text,
            answers: (q.answers || []).map((a: any) => ({
              id: a.id,
              text: a.text,
            })),
          };
        }
        setQuestionsMap(qMap);
        setLoading(false);
      } catch (err) {
        setError("Failed to load result");
        setLoading(false);
        console.error(err);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchResponses = async () => {
      try {
        const res = await api.get(`/assessments/${id}/responses`, {
          params: { page: currentPage, limit },
        });
        setResponses(res.data.data || []);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        setError("Failed to load responses");
        console.error(err);
      }
    };

    fetchResponses();
  }, [id, currentPage, limit]);

  if (loading) {
    return (
      <AppShell activeNav="all">
        <div>Loading your result...</div>
      </AppShell>
    );
  }

  if (error || !result) {
    return (
      <AppShell activeNav="all">
        <div className="text-red-500">{error || "Result not found"}</div>
      </AppShell>
    );
  }

  return (
    <AppShell activeNav="all">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Result</h1>
      </div>

      {/* Result Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="text-center py-6">
          <div className="text-5xl font-bold text-primary-600 mb-2">{result.mbti_type}</div>
          <p className="text-gray-600">MBTI Personality Type</p>
        </div>
      </div>

      {/* Responses */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Your Answers</h2>
        {responses.length === 0 ? (
          <p className="text-gray-500">No responses recorded.</p>
        ) : (
          <ul className="space-y-4">
            {responses.map((resp) => {
              const question = questionsMap[resp.question_id];
              const answerText = resp.free_text
                ? resp.free_text
                : question?.answers.find((a) => a.id === resp.answer_id)?.text || "—";

              return (
                <li key={resp.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Q:</span> {question?.text || "Unknown question"}
                  </div>
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">A:</span> {answerText}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <Button
              variant="ghost"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ‹ Previous
            </Button>
            <span className="flex items-center px-3 text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="ghost"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next ›
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button variant="primary" onClick={() => window.history.back()}>
          Back to Assessments
        </Button>
      </div>
    </AppShell>
  );
}
