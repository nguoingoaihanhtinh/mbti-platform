import { createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "../../stores/useAuthStore";
import CompanyCreateAssignmentPage from "../../pages/company/CompanyCreateAssignmentPage";

export const Route = createFileRoute("/company/assignments/create")({
  beforeLoad: async () => {
    const { user, isAuthenticated, login } = useAuthStore.getState();

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
  component: CompanyCreateAssignmentPage,
});
