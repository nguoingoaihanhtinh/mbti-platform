import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useDynamicTranslation } from "../libs/translations";

export default function ForgotPasswordPage() {
  const { tContent } = useDynamicTranslation();
  const [email, setEmail] = useState("");
  const { forgotPassword, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      navigate({ to: "/reset-password" });
    } catch (err) {}
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-16 bg-primary rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">H&HIS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tContent("Forgot Password")}</h1>
          <p className="text-gray-600">{tContent("Enter your email to receive a reset OTP")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Email Address")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tContent("Enter your email")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <Button type="submit" variant="primary" size="md" fullWidth disabled={loading}>
              {loading ? tContent("Sending...") : tContent("Send OTP")}
            </Button>

            <Button
              type="button"
              variant="link"
              className="w-full text-center"
              onClick={() => navigate({ to: "/login" })}
            >
              ← {tContent("Back to Login")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
