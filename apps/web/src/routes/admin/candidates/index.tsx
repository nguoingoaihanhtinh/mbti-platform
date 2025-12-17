import { createFileRoute } from "@tanstack/react-router";
import AdminCandidatesPage from "../../../pages/admin/AdminCandidatePage";

export const Route = createFileRoute("/admin/candidates/")({
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
  }),
  component: AdminCandidatesPage,
});
