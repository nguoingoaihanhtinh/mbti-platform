import { createFileRoute } from "@tanstack/react-router";
import CompanySignupPage from "../../pages/company/CompanySignUpPage";

export const Route = createFileRoute("/company/signup")({
  component: CompanySignupPage,
});
