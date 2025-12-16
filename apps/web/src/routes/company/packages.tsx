import { createFileRoute } from "@tanstack/react-router";
import CompanyPackagePage from "../../pages/company/CompanyPackagePage";

export const Route = createFileRoute("/company/packages")({
  component: CompanyPackagePage,
});
