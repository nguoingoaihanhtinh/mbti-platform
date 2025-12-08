// src/pages/TestPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/button";
import { useTest } from "../hooks/useTests";
import api from "../libs/api";
import type { Answer, Question } from "../types/test";

const INITIAL_SECONDS = 42 * 60 + 15;

export default function TestPage() {
  const { testId } = useSearch({ from: "/test" });

  if (!testId) {
    return <div>Invalid test ID</div>;
  }
  const navigate = useNavigate();

  const { data: test, isLoading, error } = useTest(testId);

  const [page, setPage] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(INITIAL_SECONDS);

  if (isLoading) return <div>Loading test...</div>;
  if (error || !test) return <div>Failed to load test.</div>;

  const questions = test.questions || [];
  const totalQuestions = questions.length;
  const question = questions[page - 1];

  const answers = question?.answers || [];

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPct = totalQuestions ? Math.round(((page - 1) / totalQuestions) * 100) : 0;
  const handleSubmitTest = async () => {
    if (!testId || !test) {
      alert("Test not ready");
      return;
    }
    console.log("Test data:", test);
    // Extract version ID
    const testVersionId = test.version?.id || test.test_version_id;
    if (!testVersionId) {
      alert("Test version missing");
      return;
    }

    try {
      const createRes = await api.post("/assessments", {
        test_id: testId,
        test_version_id: testVersionId,
        status: "started",
      });
      const assessmentId = createRes.data.id;

      const responseEntries = Object.entries(selectedAnswer);
      for (const [question_id, answer_id] of responseEntries) {
        await api.post(`/assessments/${assessmentId}/responses`, {
          question_id,
          answer_id,
        });
      }

      await api.post(`/assessments/${assessmentId}/complete`, {});

      navigate({ to: `/results/${assessmentId}` });
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit test.");
    }
  };
  const rightSidebar = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="space-y-2 text-sm">
          <Button variant="ghost" className="w-full justify-start px-4 py-2 bg-gray-50 hover:bg-gray-100">
            📊 View Progress Report
          </Button>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 bg-gray-50 hover:bg-gray-100">
            📝 Schedule Study Time
          </Button>
          <Button variant="ghost" className="w-full justify-start px-4 py-2 bg-gray-50 hover:bg-gray-100">
            💡 Study Hints
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <AppShell activeNav="all" rightSidebar={rightSidebar}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        {/* Header */}
        <div className="flex justify-between flex-wrap gap-4 items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{test.title}</h1>
            <p className="text-sm text-gray-600 flex items-center gap-3">
              <span>{totalQuestions} questions</span>
              <span className="inline-flex items-center gap-1">
                Time Remaining:
                <span
                  className={`font-semibold tabular-nums ${timeLeft < 60 ? "text-red-600 animate-pulse" : "text-red-500"}`}
                >
                  {formatTime(timeLeft)}
                </span>
              </span>
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Question {page} / {totalQuestions}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="w-full bg-secondary-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium">{progressPct}% complete</div>
        </div>

        {/* Question */}
        <div className="mb-8">
          {question ? (
            <>
              <h2 className="text-lg font-semibold mb-6">{question.text}</h2>
              <div className="space-y-3">
                {answers.map((ans: Answer) => {
                  const active = selectedAnswer[question.id] === ans.id;
                  return (
                    <button
                      key={ans.id}
                      type="button"
                      disabled={timeLeft === 0}
                      onClick={() => setSelectedAnswer((s) => ({ ...s, [question.id]: ans.id }))}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        active ? "border-primary bg-white" : "border-gray-200 bg-white"
                      } ${timeLeft === 0 ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                            active ? "border-primary-500 bg-primary-500" : "border-primary-300 bg-white"
                          }`}
                        >
                          {active && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <span className="font-medium">{ans.order_index}.</span> {ans.text}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <p>No question found.</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button variant="ghost" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="gap-2">
            ‹ Previous
          </Button>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleSubmitTest} disabled={page !== totalQuestions}>
              Submit Test
            </Button>
            <Button variant="secondary" disabled={page === totalQuestions} onClick={() => setPage((p) => p + 1)}>
              Next ›
            </Button>
          </div>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold mb-4">Question Navigator</h3>
        <div className="grid grid-cols-10 gap-2 mb-4">
          {questions.map((q: Question, i: number) => {
            const num = i + 1;
            const isCurrent = num === page;
            const isAnswered = selectedAnswer[q.id] != null;

            return (
              <Button
                key={q.id}
                onClick={() => setPage(num)}
                size="sm"
                variant={isCurrent ? "primary" : isAnswered ? "secondary" : "outline"}
                className="w-9 h-9 p-0 text-sm font-medium"
                disabled={timeLeft === 0}
              >
                {num}
              </Button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
