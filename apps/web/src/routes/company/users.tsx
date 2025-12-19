import { createFileRoute } from "@tanstack/react-router";

const UserPage = () => {
  return <div>Company Users Page</div>;
};
export const Route = createFileRoute("/company/users")({
  component: UserPage,
});
