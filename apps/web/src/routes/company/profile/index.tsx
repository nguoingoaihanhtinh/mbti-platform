import { createFileRoute } from "@tanstack/react-router";
import CompanyProfilePage from "../../../pages/company/CompanyProfilePage";

export const Route = createFileRoute("/company/profile/")({
  component: CompanyProfilePage,
});
