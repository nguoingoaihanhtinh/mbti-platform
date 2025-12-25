// src/components/layout/AppShell.tsx (for Company + Candidate)
import React, { useState } from "react";
import {
  Bell,
  User,
  Home,
  BarChart3,
  Settings,
  LogOut,
  FileText,
  Package,
  CreditCard,
  Linkedin,
  Github,
} from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "@tanstack/react-router";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";
interface AppShellProps {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
  activeNav?: string;
}

// Navigation for Company

export function AppShell({ children, rightSidebar, activeNav = "assessments" }: AppShellProps) {
  const { user, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
  const companyNavItems = [
    { id: "dashboard", label: t("dashboard"), icon: Home, path: "/company/dashboard" },
    { id: "assignments", label: t("assignments"), icon: FileText, path: "/company/assignments" },
    { id: "packages", label: t("packages"), icon: Package, path: "/company/packages" },
    { id: "subscription", label: t("current_subscription"), icon: CreditCard, path: "/company/subscription" },
    { id: "profile", label: t("company_info"), icon: Settings, path: "/company/profile" },
  ];

  const candidateNavItems = [
    { id: "assessments", label: t("all_tests"), icon: Home, path: "/assessments" },
    { id: "about", label: t("about_mbti"), icon: BarChart3, path: "/about/mbti" },
    { id: "profile", label: t("profile_settings"), icon: Settings, path: "/profile" },
  ];

  if (!user) {
    return <div className="min-h-screen bg-secondary-50 flex items-center justify-center">Loading...</div>;
  }

  // Determine which nav items to show
  const navItems = user.role === "company" ? companyNavItems : candidateNavItems;
  const isCompany = user.role === "company";

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-secondary-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Group 50.png" alt="H&HIS Assessment" className="h-8 w-auto" />
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button className="p-2 hover:bg-secondary-100 rounded-lg">
              <Bell className="w-5 h-5 text-neutral-600" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="p-2 hover:bg-secondary-100 rounded-lg"
              >
                <User className="w-5 h-5 text-neutral-600" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-secondary-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-secondary-100 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t("logout")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-secondary-200 min-h-screen p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-secondary-200 rounded-full mb-3 flex items-center justify-center">
              <User className="w-10 h-10 text-neutral-500" />
            </div>
            <h3 className="font-semibold text-lg text-primary-900">{user.full_name}</h3>
            <p className="text-sm text-neutral-500">{user.email}</p>
            {user.id && <p className="text-xs text-neutral-400 mt-1">User ID: {user.id.substring(0, 8)}</p>}
          </div>

          {/* Profile Summary (Candidate only) */}
          {!isCompany && (
            <div className="space-y-4 mb-6">
              {/* Role */}
              <div>
                <h4 className="text-xs font-semibold text-neutral-500 mb-1">{t("role")}</h4>
                <p className="text-sm font-medium text-primary-900 capitalize">{t(user.role)}</p>
              </div>

              {/* Education (only if exists) */}
              {user.profile?.education && (
                <div>
                  <h4 className="text-xs font-semibold text-neutral-500 mb-1">{t("education")}</h4>
                  <p className="text-sm text-neutral-700">{user.profile.education}</p>
                </div>
              )}

              {/* Social Links (only if any exist) */}
              {(user.profile?.social_links?.linkedin || user.profile?.social_links?.github) && (
                <div>
                  <h4 className="text-xs font-semibold text-neutral-500 mb-1">{t("social")}</h4>
                  <div className="flex flex-col gap-1">
                    {user.profile.social_links.linkedin && (
                      <a
                        href={user.profile.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>{t("linkedin")}</span>
                      </a>
                    )}
                    {user.profile.social_links.github && (
                      <a
                        href={user.profile.social_links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-800 hover:text-black"
                      >
                        <Github className="w-4 h-4" />
                        <span>{t("github")}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <nav className={`${!isCompany ? "pt-4 border-t border-secondary-200" : ""}`}>
            {navItems.map((n) => {
              const Icon = n.icon;
              const active = n.id === activeNav;
              return (
                <button
                  key={n.id}
                  onClick={() => navigate({ to: n.path })}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                    active ? "bg-primary text-primary-foreground" : "text-neutral-700 hover:bg-secondary-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{n.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 text-primary-900">{children}</main>

        {/* Right Sidebar (Candidate only) */}
        {rightSidebar && !isCompany && (
          <aside className="w-64 bg-white border-l border-secondary-200 min-h-screen p-6">{rightSidebar}</aside>
        )}
      </div>
    </div>
  );
}
