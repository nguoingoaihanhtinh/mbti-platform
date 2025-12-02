import React from "react";
import { Bell, User, Home, BookOpen, BarChart3, Settings } from "lucide-react";

/**
 * Shared application shell for authenticated pages.
 * Provides header, left sidebar, optional right sidebar, and main content.
 */
interface AppShellProps {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
  activeNav?: "all" | "analytics" | "seasonal" | "profile";
}

const navItems = [
  { id: "all", label: "All Tests", icon: Home },
  { id: "analytics", label: "Analytics", icon: BookOpen },
  { id: "seasonal", label: "Seasonal", icon: BarChart3 },
  { id: "profile", label: "Profile Settings", icon: Settings },
];

export function AppShell({ children, rightSidebar, activeNav = "all" }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">NIIT | Assessment</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-3 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="font-semibold text-lg">Scott Johnson</h3>
            <p className="text-sm text-gray-500">Computer Science Student</p>
            <p className="text-xs text-gray-400 mt-1">User ID: 2,400.00</p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-2">INTLA</h4>
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs text-gray-500 mt-1">Remaining</div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-2">LEVEL</h4>
              <div className="text-2xl font-bold">45</div>
            </div>

            <nav className="space-y-2 pt-4">
              {navItems.map((n) => {
                const Icon = n.icon;
                const active = n.id === activeNav;
                return (
                  <button
                    key={n.id}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                      active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{n.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>

        {/* Optional Right Sidebar */}
        {rightSidebar && (
          <aside className="w-64 bg-white border-l border-gray-200 min-h-screen p-6">{rightSidebar}</aside>
        )}
      </div>
    </div>
  );
}
