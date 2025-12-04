import React from "react";
import { Bell, User, Home, BookOpen, BarChart3, Settings, LogOut, type LucideIcon } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useNavigate } from "@tanstack/react-router";

interface AppShellProps {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
  activeNav?: "all" | "analytics" | "seasonal" | "profile";
}

const navItems: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "All Tests", icon: Home },
  { id: "analytics", label: "Analytics", icon: BookOpen },
  { id: "seasonal", label: "Seasonal", icon: BarChart3 },
  { id: "profile", label: "Profile Settings", icon: Settings },
];

export function AppShell({ children, rightSidebar, activeNav = "all" }: AppShellProps) {
  const { logout: logoutStore } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend to clear cookies
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      // Clear Zustand state
      logoutStore();
      // Redirect to login
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      // Still log out locally
      logoutStore();
      navigate({ to: "/login" });
    }
  };

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
              {React.createElement(Bell as any, { className: "w-5 h-5 text-neutral-600" })}
            </button>
            <div className="relative group">
              <button className="p-2 hover:bg-secondary-100 rounded-lg">
                {React.createElement(User as any, { className: "w-5 h-5 text-neutral-600" })}
              </button>
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white border border-secondary-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-secondary-100 rounded-lg"
                >
                  {React.createElement(LogOut as any, { className: "w-4 h-4" })}
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
              {React.createElement(User as any, { className: "w-10 h-10 text-neutral-500" })}
            </div>
            <h3 className="font-semibold text-lg text-primary-900">Scott Johnson</h3>
            <p className="text-sm text-neutral-500">Computer Science Student</p>
            <p className="text-xs text-neutral-400 mt-1">User ID: 2,400.00</p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-neutral-500 mb-2">INTLA</h4>
              <div className="text-2xl font-bold text-primary-900">12</div>
              <div className="text-xs text-neutral-500 mt-1">Remaining</div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-neutral-500 mb-2">LEVEL</h4>
              <div className="text-2xl font-bold text-primary-900">45</div>
            </div>

            <nav className="space-y-2 pt-4">
              {navItems.map((n) => {
                const Icon = n.icon;
                const active = n.id === activeNav;
                return (
                  <button
                    key={n.id}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                      active ? "bg-primary text-primary-foreground" : "text-neutral-700 hover:bg-secondary-100"
                    }`}
                  >
                    {React.createElement(Icon as any, { className: "w-5 h-5" })}
                    <span>{n.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 text-primary-900">{children}</main>

        {/* Right Sidebar */}
        {rightSidebar && (
          <aside className="w-64 bg-white border-l border-secondary-200 min-h-screen p-6">{rightSidebar}</aside>
        )}
      </div>
    </div>
  );
}
