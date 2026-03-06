import { Menu, LogOut, X } from "lucide-react";
import { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard-layout.css";

export const DashboardLayout = ({ title, navItems, theme = "emerald" }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const themeClasses = useMemo(() => {
    const palettes = {
      emerald: {
        badge: "bg-emerald-100 text-emerald-700",
        active: "bg-emerald-600 text-white",
        hover: "hover:bg-emerald-50",
        ring: "ring-emerald-100",
      },
      blue: {
        badge: "bg-blue-100 text-blue-700",
        active: "bg-blue-600 text-white",
        hover: "hover:bg-blue-50",
        ring: "ring-blue-100",
      },
      purple: {
        badge: "bg-purple-100 text-purple-700",
        active: "bg-purple-600 text-white",
        hover: "hover:bg-purple-50",
        ring: "ring-purple-100",
      },
      indigo: {
        badge: "bg-indigo-100 text-indigo-700",
        active: "bg-indigo-600 text-white",
        hover: "hover:bg-indigo-50",
        ring: "ring-indigo-100",
      },
    };

    return palettes[theme] || palettes.emerald;
  }, [theme]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="dashboard-shell">
        <aside className={`dashboard-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-slate-900">UAAMS</div>
              <div className="text-sm text-slate-500">{title}</div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="dashboard-close-button rounded-md p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? `${themeClasses.active} shadow-sm`
                        : `text-slate-700 ${themeClasses.hover}`
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <div className="dashboard-main flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="dashboard-menu-button rounded-md p-2 text-slate-600 hover:bg-slate-100"
                  aria-label="Open menu"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div>
                  <div className="text-slate-900">{title}</div>
                  <div className="text-xs text-slate-500">Route: {location.pathname}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full px-3 py-1 text-xs ring-1 ${themeClasses.badge} ${themeClasses.ring}`}
                >
                  {currentUser?.name || "User"}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      {isSidebarOpen && (
        <button
          className="dashboard-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}
    </div>
  );
};