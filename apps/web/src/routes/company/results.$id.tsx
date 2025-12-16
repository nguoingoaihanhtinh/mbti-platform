import { createFileRoute } from "@tanstack/react-router";
import CompanyResultPage from "../../pages/company/CompanyResultPage";

export const Route = createFileRoute("/company/results/$id")({
  validateSearch: (search) => ({
    email: typeof search.email === "string" ? search.email : undefined,
  }),
  component: CompanyResultPage,
});
