// src/routes/assessments.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../stores/useAuthStore";
import AssessmentsPage from "../pages/AssessmentsPage";

export const Route = createFileRoute("/assessments")({
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }
  },
  component: AssessmentsPage,
});
