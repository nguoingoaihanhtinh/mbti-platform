// src/routes/assessments.tsx
import { createFileRoute } from "@tanstack/react-router";
import AssessmentsPage from "../pages/AssessmentsPage";

export const Route = createFileRoute("/assessments")({
  component: AssessmentsPage,
});
