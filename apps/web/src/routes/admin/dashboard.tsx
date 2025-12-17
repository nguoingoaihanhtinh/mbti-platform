// src/routes/admin/dashboard.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "../../stores/useAuthStore";
import AdminDashboard from "../../pages/admin/AdminDashboardPage";

export const Route = createFileRoute("/admin/dashboard")({
  beforeLoad: async () => {
    const { isAuthenticated, login } = useAuthStore.getState();

    if (!isAuthenticated) {
      await login();
    }

    const currentUser = useAuthStore.getState().user;

    if (!currentUser || currentUser.role !== "admin") {
      throw redirect({
        to: "/login",
      });
    }
  },
  component: AdminDashboard,
});

// // src/routes/hr/analytics.tsx
// import { createFileRoute } from "@tanstack/react-router";
// import HRAnalyticsPage from "../../pages/hr/HRAnalyticsPage";

// export const Route = createFileRoute("/hr/analytics")({
//   component: HRAnalyticsPage,
// });

// // src/routes/hr/settings.tsx
// import { createFileRoute } from "@tanstack/react-router";
// import HRSettingsPage from "../../pages/hr/HRSettingsPage";
// import HRDashboard from "../../pages/hr/HRDashboardPage";

// export const Route = createFileRoute("/hr/settings")({
//   component: HRSettingsPage,
// });
