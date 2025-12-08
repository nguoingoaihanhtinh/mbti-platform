import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import TestPage from "../pages/TestPage";

const testSearchSchema = z.object({
  testId: z.string().uuid(),
});

export const Route = createFileRoute("/test")({
  validateSearch: (search) => {
    const result = testSearchSchema.safeParse(search);
    if (!result.success) {
      return { testId: null };
    }
    return result.data;
  },
  component: TestPage,
});
