import { createFileRoute } from "@tanstack/react-router";
import AdminPackagesPage from "../../../pages/admin/AdminPackageManagemnetPage";

export const Route = createFileRoute("/admin/packages/")({
  component: AdminPackagesPage,
});
