import { Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { HRShell, type HRNav } from "../../components/layout/HRShell";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState().location.pathname;

  const activeNav = pathname.split("/")[2] as HRNav;

  return (
    <HRShell activeNav={activeNav}>
      <Outlet />
    </HRShell>
  );
}
