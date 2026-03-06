import { useState } from "react";
import {
  School,
  Users,
  FileText,
  Settings,
  Bell,
  LogOut,
  Home,
  BookOpen,
  Hash,
  Award,
  PenTool,
  FileEdit,
  UserCircle
} from "lucide-react";
import { UniversityOverview } from "./UniversityOverview";
import { ManageApplications } from "./ManageApplications";
import { FormConfiguration } from "./FormConfiguration";
import { UniversityAnnouncements } from "./UniversityAnnouncements";
import { UniversitySettings } from "./UniversitySettings";
import { UniversityBlog } from "./UniversityBlog";
import { RollNumberManagement } from "./RollNumberManagement";
import { AdmissionLetterManagement } from "./AdmissionLetterManagement";
import { BloggerManagement } from "./BloggerManagement";
import { FormBuilder } from "./FormBuilder";
import { UniversityProfile } from "./UniversityProfile";
function UniversityDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [applicationForm, setApplicationForm] = useState([]);
  const handleSaveForm = (fields) => {
    setApplicationForm(fields);
    localStorage.setItem(`applicationForm_${user.id}`, JSON.stringify(fields));
  };
  return <div className="min-h-screen bg-slate-50">
      {
    /* Header */
  }
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <School className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-slate-900">UAAMS</div>
                <div className="text-slate-600 text-sm">University Portal</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {user.name}
              </div>
              <button
    onClick={onLogout}
    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
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
            <nav className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
              <NavItem
    icon={<Home className="w-5 h-5" />}
    label="Overview"
    active={activeTab === "overview"}
    onClick={() => setActiveTab("overview")}
  />
              <NavItem
    icon={<Users className="w-5 h-5" />}
    label="Applications"
    active={activeTab === "applications"}
    onClick={() => setActiveTab("applications")}
  />
              <NavItem
    icon={<FileEdit className="w-5 h-5" />}
    label="Form Builder"
    active={activeTab === "form-builder"}
    onClick={() => setActiveTab("form-builder")}
  />
              <NavItem
    icon={<FileText className="w-5 h-5" />}
    label="Form Config"
    active={activeTab === "form-config"}
    onClick={() => setActiveTab("form-config")}
  />
              <NavItem
    icon={<Bell className="w-5 h-5" />}
    label="Announcements"
    active={activeTab === "announcements"}
    onClick={() => setActiveTab("announcements")}
  />
              <NavItem
    icon={<BookOpen className="w-5 h-5" />}
    label="Blog"
    active={activeTab === "blog"}
    onClick={() => setActiveTab("blog")}
  />
              <NavItem
    icon={<PenTool className="w-5 h-5" />}
    label="Bloggers"
    active={activeTab === "bloggers"}
    onClick={() => setActiveTab("bloggers")}
  />
              <NavItem
    icon={<Hash className="w-5 h-5" />}
    label="Roll Numbers"
    active={activeTab === "roll-numbers"}
    onClick={() => setActiveTab("roll-numbers")}
  />
              <NavItem
    icon={<Award className="w-5 h-5" />}
    label="Admission Letters"
    active={activeTab === "admission-letters"}
    onClick={() => setActiveTab("admission-letters")}
  />
              <NavItem
    icon={<UserCircle className="w-5 h-5" />}
    label="Profile"
    active={activeTab === "profile"}
    onClick={() => setActiveTab("profile")}
  />
              <NavItem
    icon={<Settings className="w-5 h-5" />}
    label="Settings"
    active={activeTab === "settings"}
    onClick={() => setActiveTab("settings")}
  />
            </nav>
          </div>

          {
    /* Main Content */
  }
          <div className="lg:col-span-4">
            {activeTab === "overview" && <UniversityOverview onNavigate={setActiveTab} />}
            {activeTab === "applications" && <ManageApplications universityId={user.id} />}
            {activeTab === "form-builder" && <FormBuilder
    universityId={user.id}
    onSave={handleSaveForm}
    initialFields={applicationForm}
  />}
            {activeTab === "form-config" && <FormConfiguration />}
            {activeTab === "announcements" && <UniversityAnnouncements />}
            {activeTab === "blog" && <UniversityBlog />}
            {activeTab === "bloggers" && <BloggerManagement universityName={user.name} />}
            {activeTab === "roll-numbers" && <RollNumberManagement />}
            {activeTab === "admission-letters" && <AdmissionLetterManagement />}
            {activeTab === "profile" && <UniversityProfile universityId={user.id} initialName={user.name} />}
            {activeTab === "settings" && <UniversitySettings />}
          </div>
        </div>
      </div>
    </div>;
}
function NavItem({
  icon,
  label,
  active,
  onClick
}) {
  return <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
  >
      {icon}
      <span>{label}</span>
    </button>;
}
export {
  UniversityDashboard
};
