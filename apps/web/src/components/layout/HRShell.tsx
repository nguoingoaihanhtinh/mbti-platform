import React from "react";
import { Bell, User, Home, Users, BarChart3, Settings, LogOut, type LucideIcon } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";
export type HRNav =
  | "dashboard"
  | "candidates"
  | "analytics"
  | "settings"
  | "companies"
  | "packages"
  | "tests"
  | "users";

interface HRShellProps {
  children: React.ReactNode;
  activeNav?: HRNav;
}

export function HRShell({ children, activeNav = "dashboard" }: HRShellProps) {
  const { user, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      logoutStore();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      logoutStore();
      navigate({ to: "/login" });
    }
  };
  const navItems: { id: HRNav; label: string; icon: LucideIcon }[] = [
    { id: "dashboard", label: t("overview"), icon: Home },
    { id: "companies", label: t("companies"), icon: Home },
    { id: "packages", label: t("service_packages"), icon: BarChart3 },
    { id: "tests", label: t("tests"), icon: BarChart3 },
    { id: "users", label: t("users"), icon: Users },
    { id: "candidates", label: t("candidates"), icon: Users },
  ];

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unauthorized access</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3">
                <img src="/Group 50.png" alt="H&HIS Assessment" className="h-8 w-auto" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t("platform_name")}</h1>
                <p className="text-xs text-gray-500">{t("platform_slogan")}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">{t("hr_company")}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
            <LanguageSwitcher />
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
            </button>

            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-500 delay-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("logout")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeNav;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate({ to: `/admin/${item.id}` })}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
