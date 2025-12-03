import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    await register({
      email: formData.email,
      full_name: formData.fullName,
      password: formData.password,
      confirm_password: formData.confirmPassword,
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-16 bg-primary rounded-2xl mb-4">
            <span className="text-white text-2xl font-bold">H&HIS</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Start your learning journey today</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSignup} className="space-y-5">
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
