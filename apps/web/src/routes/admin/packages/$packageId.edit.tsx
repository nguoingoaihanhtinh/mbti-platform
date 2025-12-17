import { createFileRoute, useParams } from "@tanstack/react-router";
import AdminPackageFormPage from "../../../pages/admin/AdminPackageFormPage";

export const Route = createFileRoute("/admin/packages/$packageId/edit")({
  component: EditPackagePage,
});

function EditPackagePage() {
  const { packageId } = useParams({
    from: "/admin/packages/$packageId/edit",
  });

  return <AdminPackageFormPage packageId={packageId} />;
}
