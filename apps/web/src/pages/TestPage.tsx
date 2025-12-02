import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/button";

const INITIAL_SECONDS = 42 * 60 + 15;

export default function TestPage() {
  const navigate = useNavigate();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(12);
  const [timeLeft, setTimeLeft] = useState(INITIAL_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const testData = useMemo(
    () => ({
      title: "JavaScript Fundamentals Test",
      totalQuestions: 25,
      question: "What is the correct way to declare a variable in JavaScript that can be reassigned?",
      options: [
        { id: "A", text: "const variableName = value;", note: "Using const keyword" },
        { id: "B", text: "let variableName = value;", note: "Using let keyword" },
        { id: "C", text: "var variableName = value;", note: "Using var keyword" },
        { id: "D", text: "All of the above", note: "Any of these methods work" },
      ],
      achievements: [
        { icon: "🎯", label: "Speed", count: 8 },
        { icon: "🔥", label: "Streak", count: 12 },
        { icon: "🏆", label: "Accuracy", count: 94 },
      ],
    }),
    []
  );

  const progressPct = Math.round(((currentQuestion - 1) / testData.totalQuestions) * 100);

  const rightSidebar = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="space-y-2 text-sm">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left rounded-lg"
          >
            📊 View Progress Report
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left rounded-lg"
          >
            📝 Schedule Study Time
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 bg-gray-50 hover:bg-gray-100 text-left rounded-lg"
          >
            💡 Study Hints
          </Button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-3">Achievements</h3>
        <div className="flex flex-wrap gap-4">
          {testData.achievements.map((a) => (
            <div key={a.label} className="text-center">
              <div className="text-2xl">{a.icon}</div>
              <div className="text-xs text-gray-600">{a.label}</div>
              <div className="text-sm font-semibold">{a.count}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <AppShell activeNav="all" rightSidebar={rightSidebar}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        <div className="flex justify-between flex-wrap gap-4 items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">{testData.title}</h1>
            <p className="text-sm text-gray-600 flex items-center gap-3">
              <span>{testData.totalQuestions} questions</span>
              <span className="inline-flex items-center gap-1">
                Time Remaining:
                <span
                  className={`font-semibold tabular-nums ${
                    timeLeft < 60 ? "text-red-600 animate-pulse" : "text-red-500"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              </span>
            </p>
          </div>
          <div className="text-sm text-gray-600">
            Question {currentQuestion} / {testData.totalQuestions}
          </div>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gray-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium">{progressPct}% complete</div>
        </div>
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-6">{testData.question}</h2>
          <div className="space-y-3">
            {testData.options.map((option) => {
              const active = selectedAnswer === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={timeLeft === 0}
                  onClick={() => timeLeft > 0 && setSelectedAnswer(option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition
                    ${active ? "border-gray-900 bg-white" : "border-gray-200 bg-white"}
                    ${timeLeft === 0 ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"}`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        active ? "border-gray-900 bg-gray-900" : "border-gray-300"
                      }`}
                    >
                      {active && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div>
                      <span className="font-medium">{option.id}.</span> {option.text}
                      <p className="text-sm text-gray-500 mt-1">{option.note}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            disabled={currentQuestion === 1 || timeLeft === 0}
            onClick={() => setCurrentQuestion((c) => (c > 1 ? c - 1 : c))}
            className="gap-2 disabled:opacity-40"
          >
            ‹ Previous
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate({ to: "/assessments" })}
              variant="primary"
              size="md"
              disabled={timeLeft === 0}
            >
              {timeLeft === 0 ? "Time Up" : "Submit Test"}
            </Button>
            <Button
              onClick={() => setCurrentQuestion((c) => (c < testData.totalQuestions ? c + 1 : c))}
              variant="secondary"
              size="md"
              disabled={timeLeft === 0}
            >
              Next ›
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="font-semibold mb-4">Question Navigator</h3>
        <div className="grid grid-cols-10 gap-2 mb-4">
          {Array.from({ length: testData.totalQuestions }, (_, i) => {
            const num = i + 1;
            const isCurrent = num === currentQuestion;
            const isAnswered = num < currentQuestion && selectedAnswer !== null;
            return (
              <Button
                key={num}
                onClick={() => timeLeft > 0 && setCurrentQuestion(num)}
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
        <div className="flex gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-900 rounded"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>Previous</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-gray-300 rounded"></div>
            <span>Not Answered</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
