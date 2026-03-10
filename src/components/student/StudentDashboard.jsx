import { useState } from "react";
import {
  GraduationCap,
  User,
  School,
  FileText,
  Bell,
  LogOut,
  Home,
  TrendingUp,
  BookOpen,
  Award
} from "lucide-react";
import { StudentProfile } from "./StudentProfile";
import { UniversityRecommendations } from "./UniversityRecommendations";
import { MyApplications } from "./MyApplications";
import { Announcements } from "./Announcements";
import { StudentBlog } from "./StudentBlog";
import { MeritLists } from "./MeritLists";
function StudentDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [profileComplete, setProfileComplete] = useState(false);
  return <div className="min-h-screen bg-slate-50">
      {
    /* Header */
  }
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-emerald-600" />
              <span className="text-emerald-900">UAAMS</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-700">Welcome, {user.name}</span>
              <button
    onClick={onLogout}
    className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
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
    icon={<User className="w-5 h-5" />}
    label="My Profile"
    active={activeTab === "profile"}
    onClick={() => setActiveTab("profile")}
  />
              <NavItem
    icon={<TrendingUp className="w-5 h-5" />}
    label="Recommendations"
    active={activeTab === "recommendations"}
    onClick={() => setActiveTab("recommendations")}
  />
              <NavItem
    icon={<FileText className="w-5 h-5" />}
    label="My Applications"
    active={activeTab === "applications"}
    onClick={() => setActiveTab("applications")}
  />
              <NavItem
    icon={<Award className="w-5 h-5" />}
    label="Merit Lists"
    active={activeTab === "merit-lists"}
    onClick={() => setActiveTab("merit-lists")}
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
            </nav>
          </div>

          {
    /* Main Content */
  }
          <div className="lg:col-span-4">
            {activeTab === "overview" && <OverviewTab profileComplete={profileComplete} onNavigate={setActiveTab} />}
            {activeTab === "profile" && <StudentProfile studentId={user.id} initialName={user.name} />}
            {activeTab === "recommendations" && <UniversityRecommendations />}
            {activeTab === "applications" && <MyApplications />}
            {activeTab === "merit-lists" && <MeritLists />}
            {activeTab === "announcements" && <Announcements />}
            {activeTab === "blog" && <StudentBlog />}
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
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
  >
      {icon}
      <span>{label}</span>
    </button>;
}
function OverviewTab({
  profileComplete,
  onNavigate
}) {
  return <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">Student Dashboard</h1>
        <p className="text-slate-600">Manage your university applications from one place</p>
      </div>

      {!profileComplete && <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-amber-900 mb-2">Complete Your Profile</h3>
          <p className="text-amber-700 mb-4 text-sm">
            Complete your profile to get personalized university recommendations and start applying.
          </p>
          <button
    onClick={() => onNavigate("profile")}
    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
  >
            Complete Profile
          </button>
        </div>}

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
    icon={<School className="w-8 h-8 text-blue-600" />}
    title="Applications Submitted"
    value="0"
    bgColor="bg-blue-50"
  />
        <StatCard
    icon={<TrendingUp className="w-8 h-8 text-emerald-600" />}
    title="Recommendations"
    value="0"
    bgColor="bg-emerald-50"
  />
        <StatCard
    icon={<Bell className="w-8 h-8 text-purple-600" />}
    title="New Announcements"
    value="5"
    bgColor="bg-purple-50"
  />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <QuickActionCard
    title="Browse Universities"
    description="Explore partner universities and their programs"
    buttonText="View Recommendations"
    onClick={() => onNavigate("recommendations")}
  />
        <QuickActionCard
    title="Track Applications"
    description="Monitor the status of your submitted applications"
    buttonText="View Applications"
    onClick={() => onNavigate("applications")}
  />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Recent Announcements</h3>
        <div className="space-y-3">
          <AnnouncementItem
    university="NUST"
    title="Fall 2025 Admissions Open"
    date="2 days ago"
  />
          <AnnouncementItem
    university="FAST"
    title="Merit List Published"
    date="5 days ago"
  />
          <AnnouncementItem
    university="LUMS"
    title="Application Deadline Extended"
    date="1 week ago"
  />
        </div>
        <button
    onClick={() => onNavigate("announcements")}
    className="mt-4 text-emerald-600 hover:text-emerald-700 text-sm"
  >
          View All Announcements →
        </button>
      </div>
    </div>;
}
function StatCard({
  icon,
  title,
  value,
  bgColor
}) {
  return <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-slate-600 text-sm mb-1">{title}</div>
      <div className="text-slate-900 text-3xl">{value}</div>
    </div>;
}
function QuickActionCard({
  title,
  description,
  buttonText,
  onClick
}) {
  return <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-4">{description}</p>
      <button
    onClick={onClick}
    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
  >
        {buttonText}
      </button>
    </div>;
}
function AnnouncementItem({
  university,
  title,
  date
}) {
  return <div className="flex justify-between items-start p-3 bg-slate-50 rounded-lg">
      <div>
        <div className="text-emerald-600 text-sm">{university}</div>
        <div className="text-slate-900">{title}</div>
      </div>
      <div className="text-slate-500 text-sm whitespace-nowrap ml-4">{date}</div>
    </div>;
}
export {
  StudentDashboard
};
