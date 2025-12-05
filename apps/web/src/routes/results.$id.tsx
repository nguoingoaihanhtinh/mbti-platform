// src/routes/results.$id.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ResultsPage } from "../pages/ResultsPage";

export const Route = createFileRoute("/results/$id")({
  component: ResultsPage,
});
