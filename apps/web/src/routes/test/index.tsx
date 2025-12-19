import { createFileRoute } from "@tanstack/react-router";
import TestPage from "../../pages/TestPage";
export const Route = createFileRoute("/test/")({
  validateSearch: (search) => {
    return {
      testId: typeof search.testId === "string" && search.testId.length > 0 ? search.testId : undefined,
      assessmentId:
        typeof search.assessmentId === "string" && search.assessmentId.length > 0 ? search.assessmentId : undefined, // ← THÊM DÒNG NÀY
      candidateEmail:
        typeof search.candidateEmail === "string" && search.candidateEmail.length > 0
          ? search.candidateEmail
          : undefined,
    };
  },
  component: TestPage,
});
