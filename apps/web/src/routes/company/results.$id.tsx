import { createFileRoute } from "@tanstack/react-router";
import CompanyResultDetailPage from "../../pages/company/CompanyResultDetailPage";

export const Route = createFileRoute("/company/results/$id")({
  validateSearch: (search) => ({
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  component: CompanyResultDetailPage,
});
