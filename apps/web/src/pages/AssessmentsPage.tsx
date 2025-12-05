import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/button";
import { useTests } from "../hooks/useTests";
import { useAssessments } from "../hooks/useAssessments";

import type { Assessment } from "../types/assessment";
import type { Test } from "../types/test";

type View = "tests" | "assessments";

export default function AssessmentsPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("assessments");

  const { data: testsData, isLoading: loadingTests } = useTests(1, 20);
  const { data: assessmentsData, isLoading: loadingAssessments } = useAssessments(1, 20);

  const isLoading = view === "tests" ? loadingTests : loadingAssessments;

  const tests = testsData?.data || [];
  const assessments = assessmentsData?.data || [];

  return (
    <AppShell activeNav="all">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{view === "tests" ? "Available Tests" : "My Assessments"}</h1>
        <p className="text-gray-600">
          {view === "tests"
            ? "Browse and start new personality tests"
            : "Manage your personality tests and study results"}
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex gap-4 mb-6">
        <Button variant={view === "tests" ? "primary" : "ghost"} onClick={() => setView("tests")}>
          Available Tests
        </Button>
        <Button variant={view === "assessments" ? "primary" : "ghost"} onClick={() => setView("assessments")}>
          My Assessments
        </Button>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div>Loading...</div>
      ) : view === "tests" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test: Test) => (
            <div key={test.id} className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-lg mb-2">{test.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{test.description}</p>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  // Start a NEW assessment for this test
                  // You’ll need an API call to POST /assessments with test_id
                  // For now, just navigate — you'll handle creation on /test
                  navigate({ to: "/test", search: { testId: test.id } });
                }}
              >
                Take Test
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessments.length === 0 ? (
            <div className="col-span-2 text-gray-500">You haven’t started any assessments yet.</div>
          ) : (
            assessments.map((assessment: Assessment) => (
              <div key={assessment.id} className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-semibold text-lg mb-2">Assessment #{assessment.id}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Status: <span className="capitalize">{assessment.status}</span>
                </p>
                {assessment.completed_at && (
                  <p className="text-sm text-gray-500 mb-4">
                    Completed: {new Date(assessment.completed_at).toLocaleDateString()}
                  </p>
                )}
                <Button
                  key={assessment.id}
                  onClick={() => {
                    if (assessment.status === "completed") {
                      // ✅ Use result route
                      navigate({ to: `/results/${assessment.id}` });
                    } else {
                      // ✅ Start new test (or later: resume via different route)
                      navigate({ to: "/test", search: { testId: assessment.test_id } });
                    }
                  }}
                >
                  {assessment.status === "completed" ? "View Result" : "Continue"}
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </AppShell>
  );
}
