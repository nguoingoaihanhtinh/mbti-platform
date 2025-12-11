import { createFileRoute } from "@tanstack/react-router";

import TestPage from "../../pages/TestPage";

export const Route = createFileRoute("/test/")({
  validateSearch: (search) => {
    return {
      testId: typeof search.testId === "string" ? search.testId : undefined,
    };
  },
  component: TestPage,
});
