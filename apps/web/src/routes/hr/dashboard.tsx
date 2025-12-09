// // src/routes/hr/dashboard.tsx
// import { createFileRoute, redirect } from "@tanstack/react-router";
// import { useAuthStore } from "../../stores/useAuthStore";
// import { AppShell } from "../../components/AppShell";
// import { HRDashboardPage } from "../../pages/HRDashboardPage";

// export const Route = createFileRoute("/hr/dashboard")({
//   beforeLoad: () => {
//     const { isAuthenticated, user } = useAuthStore.getState();
//     // Optional: redirect non-employer early (UX improvement)
//     if (!isAuthenticated || user?.role !== "employer") {
//       throw redirect({ to: "/assessments" });
//     }
//   },
//   component: () => (
//     <AppShell activeNav="hr">
//       <HRDashboardPage />
//     </AppShell>
//   ),
// });
