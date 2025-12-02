import { useNavigate } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";
import { Button } from "../components/ui/button";

const assessments = [
  {
    id: 1,
    title: "NIIT1 | Personality Test",
    description: "Improve your personality by taking 15 minute simple test",
    questions: 80,
    duration: "15 mins",
  },
  {
    id: 2,
    title: "Cognitive Trackers Test",
    description: "Test your logic, etc. Improve yourself by taking weekly test",
    questions: 20,
    duration: "10 mins",
  },
  {
    id: 3,
    title: "Enneagram Assessment",
    description: "Test your logic and understand better",
    questions: 45,
    duration: "12 mins",
  },
  {
    id: 4,
    title: "Big Five | Personality",
    description: "Measure your traits, understand yourself, and more",
    questions: 120,
    duration: "20 mins",
  },
];

export default function AssessmentsPage() {
  const navigate = useNavigate();

  return (
    <AppShell activeNav="all">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Assessments</h1>
        <p className="text-gray-600">Manage your personality tests and study results</p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button variant="primary" size="md">
          Available Tests
        </Button>
        <Button variant="ghost" size="md">
          My Assessments
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments.map((assessment) => (
          <div key={assessment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{assessment.title}</h3>
                <p className="text-sm text-gray-600">{assessment.description}</p>
              </div>
              <Button variant="ghost" size="icon" className="p-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </Button>
            </div>

            <div className="flex gap-4 mb-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v11.494M12 6.253C10.832 6.253 9.75 7.228 9.75 8.406v7.788c0 1.178 1.082 2.153 2.25 2.153s2.25-1.075 2.25-2.153V8.406c0-1.178-1.082-2.153-2.25-2.153z"
                  />
                </svg>
                {assessment.questions} Questions
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {assessment.duration}
              </span>
            </div>

            <Button onClick={() => navigate({ to: "/test" })} variant="primary" size="md" fullWidth>
              Take Test
            </Button>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
