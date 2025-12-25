import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { Trash2 } from "lucide-react";
import { useTests } from "../hooks/useTests";
import { useAssessments, useDeleteAssessment } from "../hooks/useAssessments";
import type { Assessment } from "../types/assessment";
import type { Test } from "../types/test";
import { useDynamicTranslation } from "../libs/translations";

type View = "tests" | "assessments";

export default function AssessmentsPage() {
  const { tContent } = useDynamicTranslation();
  const navigate = useNavigate();
  const [view, setView] = useState<View>("assessments");
  const deleteAssessment = useDeleteAssessment();

  const { data: testsData, isLoading: loadingTests } = useTests(1, 20);
  const { data: assessmentsData, isLoading: loadingAssessments } = useAssessments(1, 20);

  const isLoading = view === "tests" ? loadingTests : loadingAssessments;

  const tests = testsData?.data || [];
  const assessments = assessmentsData?.data || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {view === "tests" ? tContent("Available Tests") : tContent("My Assessments")}
        </h1>
        <p className="text-gray-600">
          {view === "tests"
            ? tContent("Browse and start new personality tests")
            : tContent("Manage your personality tests and study results")}
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button variant={view === "tests" ? "primary" : "ghost"} onClick={() => setView("tests")}>
          {tContent("Available Tests")}
        </Button>
        <Button variant={view === "assessments" ? "primary" : "ghost"} onClick={() => setView("assessments")}>
          {tContent("My Assessments")}
        </Button>
      </div>

      {isLoading ? (
        <div>{tContent("Loading...")}</div>
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
                  navigate({
                    to: "/test",
                    search: {
                      testId: test.id,
                      assessmentId: undefined,
                      candidateEmail: undefined,
                    },
                  });
                }}
              >
                {tContent("Take Test")}
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assessments.length === 0 ? (
            <div className="col-span-2 text-gray-500">{tContent("You haven’t started any assessments yet.")}</div>
          ) : (
            assessments.map((assessment: Assessment) => {
              const test = tests.find((t: Test) => t.id === assessment.test_id);
              return (
                <div key={assessment.id} className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{test?.title || tContent("Unknown Test")}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {tContent("Started:")} {new Date(assessment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(tContent("Are you sure you want to delete this assessment?"))) {
                          deleteAssessment.mutate(assessment.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 p-1 rounded"
                      title={tContent("Delete assessment")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {tContent("Status:")} <span className="capitalize font-medium">{assessment.status}</span>
                  </p>

                  {assessment.completed_at && (
                    <p className="text-sm text-gray-500 mb-4">
                      {tContent("Completed:")} {new Date(assessment.completed_at).toLocaleDateString()}
                    </p>
                  )}

                  <Button
                    onClick={() => {
                      if (assessment.status === "completed") {
                        navigate({ to: `/results/${assessment.id}` });
                      } else {
                        navigate({
                          to: "/test",
                          search: {
                            testId: assessment.test_id,
                            assessmentId: assessment.id,
                            candidateEmail: undefined,
                          },
                        });
                      }
                    }}
                    className="w-full"
                  >
                    {assessment.status === "completed" ? tContent("View Result") : tContent("Continue")}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
