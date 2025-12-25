import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useDynamicTranslation } from "../libs/translations";

type LoginStep = "credentials" | "otp";

export default function LoginPage() {
  const { tContent } = useDynamicTranslation();
  const [step, setStep] = useState<LoginStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const { login, sendLoginOtp, verifyLoginOtp, loading, error } = useAuth();
  const navigate = useNavigate();

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  const handleSendOtp = async () => {
    await sendLoginOtp(email);
    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyLoginOtp(email, otp);
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen flex flex-col justify-center px-4">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{tContent("Enter OTP")}</h1>
            <p className="text-gray-600">
              {tContent("We sent a code to")} {email}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("One-Time Code")}</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder={tContent("Enter 6-digit code")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" variant="primary" size="md" fullWidth disabled={loading}>
                {loading ? tContent("Verifying...") : tContent("Verify OTP")}
              </Button>

              <Button
                type="button"
                variant="link"
                className="w-full text-center"
                onClick={() => setStep("credentials")}
              >
                ← {tContent("Back to login")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/Group 50.png" alt="H&HIS" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tContent("Welcome Back")}</h1>
          <p className="text-gray-600">{tContent("Sign in to continue your learning journey")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handlePasswordLogin} className="space-y-5">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Password")}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={tContent("Enter your password")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" variant="primary" size="md" fullWidth disabled={loading}>
              {loading ? tContent("Signing in...") : tContent("Sign In")}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm font-medium text-gray-700"
                onClick={handleSendOtp}
                disabled={loading || !email}
              >
                {tContent("Sign in with email code instead")}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">{tContent("Or")}</span>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              {tContent("Don't have an account?")}{" "}
              <Button
                type="button"
                variant="link"
                onClick={() => navigate({ to: "/signup" })}
                className="font-medium text-gray-900 hover:text-gray-700"
              >
                {tContent("Sign up")}
              </Button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
