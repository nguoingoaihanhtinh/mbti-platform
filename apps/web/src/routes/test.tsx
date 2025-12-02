// src/routes/test.tsx
import { createFileRoute } from "@tanstack/react-router";
import TestPage from "../pages/TestPage";

export const Route = createFileRoute("/test")({
  component: TestPage,
});
