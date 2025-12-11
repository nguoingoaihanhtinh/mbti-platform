import { createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "../../stores/useAuthStore";
import CompanyAssignmentsPage from "../../pages/company/CompanyAssignmentsPage";

export const Route = createFileRoute("/company/assignments")({
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
  component: CompanyAssignmentsPage,
});
