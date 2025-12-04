import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/button";
import { useTests } from "../hooks/useTests";
import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export default function AssessmentsPage() {
  const navigate = useNavigate();

  const { data } = useTests(1, 20);
  const tests = data?.data || [];

  return (
    <AppShell activeNav="all">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Assessments</h1>
        <p className="text-gray-600">Manage your personality tests and study results</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button variant="primary">Available Tests</Button>
        <Button variant="ghost">My Assessments</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map(
          (test: {
            id: Key | null | undefined;
            title:
              | string
              | number
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | null
              | undefined;
            description:
              | string
              | number
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | null
              | undefined;
          }) => (
            <div key={test.id} className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-lg mb-2">{test.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{test.description}</p>

              <Button variant="primary" fullWidth onClick={() => navigate({ to: "/test", search: { id: test.id } })}>
                Take Test
              </Button>
            </div>
          )
        )}
      </div>
    </AppShell>
  );
}
