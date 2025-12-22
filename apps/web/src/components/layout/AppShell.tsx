// src/components/layout/AppShell.tsx (for Company + Candidate)
import React from "react";
import {
  Bell,
  User,
  Home,
  Users,
  BarChart3,
  Settings,
  LogOut,
  type LucideIcon,
  FileText,
  Package,
  CreditCard,
  Linkedin,
  Github,
} from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "@tanstack/react-router";

interface AppShellProps {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
  activeNav?: string;
}

// Navigation for Company
const companyNavItems: { id: string; label: string; icon: LucideIcon; path: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home, path: "/company/dashboard" },
  { id: "assignments", label: "Assignments", icon: FileText, path: "/company/assignments" },
  { id: "candidates", label: "Ứng viên", icon: Users, path: "/company/candidates" },
  { id: "packages", label: "Gói dịch vụ", icon: Package, path: "/company/packages" },
  { id: "subscription", label: "Gói hiện tại", icon: CreditCard, path: "/company/subscription" },
  { id: "analytics", label: "Phân tích", icon: BarChart3, path: "/company/analytics" },
  { id: "settings", label: "Cài đặt", icon: Settings, path: "/company/settings" },
];

// Navigation for Candidate
const candidateNavItems: { id: string; label: string; icon: LucideIcon; path: string }[] = [
  { id: "assessments", label: "All Tests", icon: Home, path: "/assessments" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
  { id: "profile", label: "Profile Settings", icon: Settings, path: "/profile" },
];

export function AppShell({ children, rightSidebar, activeNav = "assessments" }: AppShellProps) {
  const { user, logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();

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
            <button className="p-2 hover:bg-secondary-100 rounded-lg">
              <Bell className="w-5 h-5 text-neutral-600" />
            </button>
            <div className="relative group">
              <button className="p-2 hover:bg-secondary-100 rounded-lg">
                <User className="w-5 h-5 text-neutral-600" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-secondary-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-500 delay-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-secondary-100 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
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
                <h4 className="text-xs font-semibold text-neutral-500 mb-1">ROLE</h4>
                <p className="text-sm font-medium text-primary-900 capitalize">{user.role}</p>
              </div>

              {/* Education (only if exists) */}
              {user.profile?.education && (
                <div>
                  <h4 className="text-xs font-semibold text-neutral-500 mb-1">EDUCATION</h4>
                  <p className="text-sm text-neutral-700">{user.profile.education}</p>
                </div>
              )}

              {/* Social Links (only if any exist) */}
              {(user.profile?.social_links?.linkedin || user.profile?.social_links?.github) && (
                <div>
                  <h4 className="text-xs font-semibold text-neutral-500 mb-1">SOCIAL</h4>
                  <div className="flex flex-col gap-1">
                    {user.profile.social_links.linkedin && (
                      <a
                        href={user.profile.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {user.profile.social_links.github && (
                      <a
                        href={user.profile.social_links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-800 hover:text-black"
                        title="GitHub"
                      >
                        <Github className="w-4 h-4" />
                        <span>GitHub</span>
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
