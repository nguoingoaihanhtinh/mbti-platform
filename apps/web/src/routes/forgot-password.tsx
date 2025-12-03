import { createFileRoute } from "@tanstack/react-router";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});
