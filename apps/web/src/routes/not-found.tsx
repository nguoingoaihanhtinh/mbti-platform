import { createFileRoute } from "@tanstack/react-router";
import NotFoundPage from "../pages/NotFoundPage";

export const Route = createFileRoute("/not-found")({
  component: NotFoundPage,
});
