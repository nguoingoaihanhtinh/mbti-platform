import { createFileRoute } from "@tanstack/react-router";
import TestPage from "../../pages/TestPage";

export const Route = createFileRoute("/test/")({
  validateSearch: (search) => {
    console.log("[validateSearch] search =", search);

    return {
      testId: typeof search.testId === "string" && search.testId.length > 0 ? search.testId : undefined,
    };
  },
  component: TestPage,
});
