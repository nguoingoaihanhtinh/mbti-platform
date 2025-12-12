// src/routes/guest/results.$assessmentId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import api from "../../libs/api";

export const Route = createFileRoute("/guest/results/$assessmentId")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) ?? "",
    };
  },
  component: GuestResultPage,
});

function GuestResultPage() {
  const { assessmentId } = Route.useParams();
  const { email } = Route.useSearch();

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["guest-result", assessmentId, email],
    queryFn: async () => {
      if (!email) throw new Error("Email required");
      const { data } = await api.get(`/assessments/${assessmentId}/guest-result`, {
        params: { email },
      });
      return data;
    },
    enabled: !!assessmentId && !!email,
  });
  console.log("Guest result data:", result);

  if (isLoading) return <div className="p-8">Loading result...</div>;
  if (error) return <div className="p-8 text-red-600">Failed to load result</div>;
  if (!result) return <div className="p-8">No result found</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Your MBTI Result</h1>
      <div className="mt-4 p-6 bg-purple-50 rounded-lg">
        <h2 className="text-3xl font-bold text-purple-700">{result.mbti_type}</h2>
        {result.mbti_type_details && (
          <div className="mt-4">
            <h3 className="font-semibold">Description</h3>
            <p>{result.mbti_type_details.type_description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
