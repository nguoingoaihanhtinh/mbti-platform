import { createFileRoute } from "@tanstack/react-router";
import AdminPackageFormPage from "../../../pages/admin/AdminPackageFormPage";

export const Route = createFileRoute("/admin/packages/$packageId/edit")({
  component: AdminPackageFormPage,
});
