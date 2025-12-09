import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../pages/ProfilePage";
import { AppShell } from "../components/layout/AppShell";
export const Route = createFileRoute("/profile")({
  component: () => (
    <AppShell activeNav="profile">
      <ProfilePage />
    </AppShell>
  ),
});
