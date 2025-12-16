// mbti-platform/apps/web/src/routes/admin/companies.tsx
import { createFileRoute } from "@tanstack/react-router";
import AdminCompaniesPage from "../../pages/admin/AdminCompanyListPage";

export const Route = createFileRoute("/admin/companies")({
  component: () => <AdminCompaniesPage />,
});
