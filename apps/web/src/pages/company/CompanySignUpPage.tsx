// src/pages/auth/CompanySignupPage.tsx
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../hooks/useAuth";
import { useDynamicTranslation } from "../../libs/translations";
import { Button } from "../../components/ui/button";

export default function CompanySignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });
  const { registerCompany } = useAuth();
  const navigate = useNavigate();
  const { tContent } = useDynamicTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert(tContent("Passwords don't match"));
      return;
    }

    if (!formData.companyName.trim()) {
      alert(tContent("Company name is required"));
      return;
    }

    try {
      await registerCompany({
        email: formData.email,
        full_name: formData.fullName,
        password: formData.password,
        company_name: formData.companyName,
      });
    } catch (err) {
      // Error handled in hook (alert shown via setError + UI)
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/Group 50.png" alt="H&HIS" className="h-16 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tContent("Register Your Company")}</h1>
          <p className="text-gray-600">{tContent("Create an account to assign MBTI tests to candidates")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Full Name")}</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Nguyen Van A"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Company Name")}</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. ABC Corporation"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Work Email")}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. admin@company.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Password")}</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                required
              />
              <p className="mt-1 text-xs text-gray-500">{tContent("At least 8 characters")}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{tContent("Confirm Password")}</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <Button type="submit" variant="primary" size="md" fullWidth>
              {tContent("Create Company Account")}
            </Button>

            <p className="mt-6 text-center text-sm text-gray-600">
              {tContent("Already have an account?")}{" "}
              <Button
                type="button"
                variant="link"
                onClick={() => navigate({ to: "/login" })}
                className="font-medium text-gray-900 hover:text-gray-700"
              >
                {tContent("Sign in")}
              </Button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
