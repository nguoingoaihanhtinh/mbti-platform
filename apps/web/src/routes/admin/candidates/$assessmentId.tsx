import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/useAuthStore";
import AdminCandidateDetailPage from "../../../pages/admin/AdminCandidateDetailPage";

export const Route = createFileRoute("/admin/candidates/$assessmentId")({
  beforeLoad: async () => {
    const { isAuthenticated, login } = useAuthStore.getState();

    if (!isAuthenticated) {
      await login();
    }

    const user = useAuthStore.getState().user;

    if (!user || user.role !== "admin") {
      throw redirect({ to: "/login" });
    }
  },
  component: AdminCandidateDetailPage,
});
