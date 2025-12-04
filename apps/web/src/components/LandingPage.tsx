// src/components/LandingPage.tsx
import { useNavigate } from "@tanstack/react-router";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Welcome to AI Talent — MBTI Assessment Platform</h1>
        <p className="text-xl text-gray-600 mb-8">
          A modern, secure, and scalable system for personality & safety assessments.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate({ to: "/login" })}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate({ to: "/assessments" })}
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
          >
            Browse Tests
          </button>
        </div>
      </div>
    </div>
  );
}
