// src/routes/hr/candidates.$assessmentId.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/useAuthStore";
import HRCandidateDetailPage from "../../../pages/hr/HRCandidateDetailPage";

export const Route = createFileRoute("/hr/candidates/$assessmentId")({
  beforeLoad: async () => {
    const { isAuthenticated, login } = useAuthStore.getState();

    if (!isAuthenticated) {
      await login();
    }

    const currentUser = useAuthStore.getState().user;

    if (!currentUser || currentUser.role !== "company") {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: HRCandidateDetailPage,
});
