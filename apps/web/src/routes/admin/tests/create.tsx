import { createFileRoute } from "@tanstack/react-router";
import AdminTestFormPage from "../../../pages/admin/AdminTestFormPage";

export const Route = createFileRoute("/admin/tests/create")({
  component: AdminTestFormPage,
});
