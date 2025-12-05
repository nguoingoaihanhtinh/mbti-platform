// src/pages/ResultsPage.tsx
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "../libs/api";

export function ResultsPage() {
  const { id } = useParams({ from: "/results/$id" });

  const [result, setResult] = useState<{ mbti_type: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/assessments/${id}/result`);
        setResult(res.data);
      } catch (err) {
        setError("Failed to load result");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) return <div className="p-8">Loading result...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!result) return <div className="p-8">No result found.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Test Result</h1>
      <div className="text-4xl font-bold text-blue-600 mb-6">{result.mbti_type}</div>
      <p>You've completed the assessment successfully!</p>
    </div>
  );
}
