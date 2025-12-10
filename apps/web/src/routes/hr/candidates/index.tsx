import { createFileRoute } from "@tanstack/react-router";
import HRCandidatesPage from "../../../pages/hr/HRCandidatesPage";

export const Route = createFileRoute("/hr/candidates/")({
  component: HRCandidatesPage,
});
