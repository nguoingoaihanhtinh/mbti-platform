import { createFileRoute } from "@tanstack/react-router";
import AdminTestsPage from "../../pages/admin/AdminTestListPage";

export const Route = createFileRoute("/admin/tests")({
  component: AdminTestsPage,
});
