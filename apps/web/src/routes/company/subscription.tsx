import { createFileRoute } from "@tanstack/react-router";
import CompanySubscriptionPage from "../../pages/company/CompanySubscriptionPage";

export const Route = createFileRoute("/company/subscription")({
  component: CompanySubscriptionPage,
});
