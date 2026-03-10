import { useState } from "react";
import {
  Shield,
  Users,
  School,
  PenTool,
  LogOut,
  Home
} from "lucide-react";
import { AdminOverview } from "./AdminOverview";
import { UniversityManagement } from "./UniversityManagement";
import { StudentManagement } from "./StudentManagement";
import { AllBloggersManagement } from "./AllBloggersManagement";
function SuperAdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  return <div className="min-h-screen bg-slate-50">
      {
    /* Header */
  }
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 border-b sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-white" />
              <div>
                <div className="text-white font-semibold">UAAMS - Super Admin</div>
                <div className="text-purple-100 text-sm">Complete System Management</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                {user.name}
              </div>
              <button
    onClick={onLogout}
    className="flex items-center gap-2 px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
  >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {
    /* Sidebar */
  }
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg border border-slate-200 p-4 space-y-2 shadow-sm">
              <NavItem
    icon={<Home className="w-5 h-5" />}
    label="Overview"
    active={activeTab === "overview"}
    onClick={() => setActiveTab("overview")}
  />
              <NavItem
    icon={<School className="w-5 h-5" />}
    label="Universities"
    active={activeTab === "universities"}
    onClick={() => setActiveTab("universities")}
    badge="pending"
  />
              <NavItem
    icon={<Users className="w-5 h-5" />}
    label="Students"
    active={activeTab === "students"}
    onClick={() => setActiveTab("students")}
  />
              <NavItem
    icon={<PenTool className="w-5 h-5" />}
    label="Bloggers"
    active={activeTab === "bloggers"}
    onClick={() => setActiveTab("bloggers")}
  />
            </nav>
          </div>

          {
    /* Main Content */
  }
          <div className="lg:col-span-4">
            {activeTab === "overview" && <AdminOverview />}
            {activeTab === "universities" && <UniversityManagement />}
            {activeTab === "students" && <StudentManagement />}
            {activeTab === "bloggers" && <AllBloggersManagement />}
          </div>
        </div>
      </div>
    </div>;
}
function NavItem({
  icon,
  label,
  active,
  onClick,
  badge
}) {
  return <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${active ? "bg-purple-50 text-purple-700" : "text-slate-700 hover:bg-slate-50"}`}
  >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      {badge && <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
          3
        </span>}
    </button>;
}
export {
  SuperAdminDashboard
};
