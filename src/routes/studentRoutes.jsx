import {
  Award,
  Bell,
  BookOpen,
  Calendar,
  CircleHelp,
  FileText,
  FolderOpen,
  Home,
  MessageCircle,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";
import { Announcements } from "../components/Announcements";
import { MeritLists } from "../components/MeritLists";
import { MyApplications } from "../components/MyApplications";
import { StudentBlog } from "../components/StudentBlog";
import { UniversityRecommendations } from "../components/UniversityRecommendations";
import { StudentOverviewPage } from "../pages/student/StudentOverviewPage";
import { StudentProfilePage } from "../pages/student/StudentProfilePage";
import { DashboardPlaceholderPage } from "../pages/shared/DashboardPlaceholderPage";

export const studentNavItems = [
  { to: "/student", label: "Overview", icon: Home, end: true },
  { to: "/student/profile", label: "Profile", icon: User },
  { to: "/student/recommendations", label: "Recommendations", icon: TrendingUp },
  { to: "/student/applications", label: "Applications", icon: FileText },
  { to: "/student/merit-lists", label: "Merit Lists", icon: Award },
  { to: "/student/announcements", label: "Announcements", icon: Bell },
  { to: "/student/blog", label: "Blog", icon: BookOpen },
  { to: "/student/deadlines", label: "Deadlines", icon: Calendar },
  { to: "/student/documents", label: "Documents", icon: FolderOpen },
  { to: "/student/messages", label: "Messages", icon: MessageCircle },
  { to: "/student/settings", label: "Settings", icon: Settings },
  { to: "/student/support", label: "Support", icon: CircleHelp },
];

export const studentRoutePages = [
  { index: true, element: <StudentOverviewPage /> },
  { path: "profile", element: <StudentProfilePage /> },
  { path: "recommendations", element: <UniversityRecommendations /> },
  { path: "applications", element: <MyApplications /> },
  { path: "merit-lists", element: <MeritLists /> },
  { path: "announcements", element: <Announcements /> },
  { path: "blog", element: <StudentBlog /> },
  {
    path: "deadlines",
    element: (
      <DashboardPlaceholderPage
        title="Admission Deadlines"
        subtitle="Central deadline board for each university, program, and test requirement."
        checklist={[
          "Track deadlines by program and intake",
          "Highlight critical tasks by priority",
          "Sync reminders with calendar integrations",
        ]}
      />
    ),
  },
  {
    path: "documents",
    element: (
      <DashboardPlaceholderPage
        title="Document Center"
        subtitle="Upload and verify required documents before submitting applications."
        checklist={[
          "Secure document vault with status tags",
          "Auto-check required document completeness",
          "Version history for re-uploads",
        ]}
      />
    ),
  },
  {
    path: "messages",
    element: (
      <DashboardPlaceholderPage
        title="Student Messaging"
        subtitle="Stay connected with university admission offices through structured threads."
        checklist={[
          "Role-based in-app messaging threads",
          "Priority flags for urgent messages",
          "Email and in-app notification sync",
        ]}
      />
    ),
  },
  {
    path: "settings",
    element: (
      <DashboardPlaceholderPage
        title="Student Settings"
        subtitle="Manage profile privacy, notifications, and account preferences."
        checklist={[
          "Notification channels and quiet hours",
          "Profile visibility controls",
          "Password and account security options",
        ]}
      />
    ),
  },
  {
    path: "support",
    element: (
      <DashboardPlaceholderPage
        title="Support Center"
        subtitle="Guides, FAQs, and ticket-based support for admission workflows."
        checklist={[
          "Context-aware help articles",
          "Ticket escalation and response tracking",
          "Live chat integration point",
        ]}
      />
    ),
  },
];