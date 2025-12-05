import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import TestPage from "../pages/TestPage";

export const Route = createFileRoute("/test")({
  validateSearch: (search) => {
    const parsed = z
      .object({
        testId: z.string().uuid(),
      })
      .safeParse(search);

    if (!parsed.success) {
      throw new Error("Invalid or missing testId");
    }
    return parsed.data;
  },

  component: TestPage,
});
