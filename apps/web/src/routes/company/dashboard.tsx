import { createFileRoute } from "@tanstack/react-router";
import CompanyDashboardPage from "../../pages/company/CompanyDashboardPage";

export const Route = createFileRoute("/company/dashboard")({
  component: CompanyDashboardPage,
});
