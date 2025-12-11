import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";

type SignupStep = "form" | "otp";

export default function SignupPage() {
  const [step, setStep] = useState<SignupStep>("form");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const { register, sendRegisterOtp, verifyRegisterOtp } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      await sendRegisterOtp(formData.email);
      setStep("otp");
    } catch (err) {
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyRegisterOtp({
        email: formData.email,
        otp,
        full_name: formData.fullName,
        password: formData.password,
      });
      navigate({ to: "/login" });
    } catch (err) {
      alert("Invalid OTP. Please try again.");
    }
  };

  if (step === "otp") {
    return (
      <div className="min-h-screen flex flex-col justify-center px-4">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Email</h1>
            <p className="text-gray-600">Enter the OTP sent to {formData.email}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">One-Time Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                  required
                />
              </div>
              <Button type="submit" variant="primary" size="md" fullWidth>
                Verify OTP
              </Button>
              <Button type="button" variant="link" className="w-full text-center" onClick={() => setStep("form")}>
                ← Back to signup
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Start your learning journey today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                required
              />
            </div>
            <div className="flex items-start">
              <input
                type="checkbox"
                className="w-4 h-4 mt-1 border-gray-300 rounded text-gray-900 focus:ring-gray-900"
                required
              />
              <label className="ml-2 text-sm text-gray-700 ">
                <span>I agree to the</span>
                <Button type="button" variant="link" className="h-auto px-0 text-sm">
                  Terms of Service
                </Button>
                <span>and</span>
                <Button type="button" variant="link" className="h-auto px-0 text-sm">
                  Privacy Policy
                </Button>
              </label>
            </div>
            <Button type="submit" variant="primary" size="md" fullWidth>
              Create Account
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button type="button" variant="outline" className="gap-2" onClick={() => alert("Google OAuth (pending)")}>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </Button>
              <Button type="button" variant="outline" className="gap-2" onClick={() => alert("GitHub OAuth (pending)")}>
                <span className="text-sm font-medium text-gray-700">GitHub</span>
              </Button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Button
              type="button"
              variant="link"
              onClick={() => navigate({ to: "/login" })}
              className="font-medium text-gray-900 hover:text-gray-700"
            >
              Sign in
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
