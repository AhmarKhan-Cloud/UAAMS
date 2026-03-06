import {
  BarChart3,
  Bell,
  BookOpen,
  Download,
  FileEdit,
  FileText,
  Hash,
  Home,
  PenTool,
  ScrollText,
  Settings,
  Shield,
  Sparkles,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { AdmissionLetterManagement } from "../components/AdmissionLetterManagement";
import { FormConfiguration } from "../components/FormConfiguration";
import { RollNumberManagement } from "../components/RollNumberManagement";
import { UniversityAnnouncements } from "../components/UniversityAnnouncements";
import { UniversityBlog } from "../components/UniversityBlog";
import { UniversitySettings } from "../components/UniversitySettings";
import { DashboardPlaceholderPage } from "../pages/shared/DashboardPlaceholderPage";
import { UniversityApplicationsPage } from "../pages/university/UniversityApplicationsPage";
import { UniversityBloggerManagementPage } from "../pages/university/UniversityBloggerManagementPage";
import { UniversityFormBuilderPage } from "../pages/university/UniversityFormBuilderPage";
import { UniversityOverviewPage } from "../pages/university/UniversityOverviewPage";
import { UniversityProfilePage } from "../pages/university/UniversityProfilePage";

export const universityNavItems = [
  { to: "/university", label: "Overview", icon: Home, end: true },
  { to: "/university/applications", label: "Applications", icon: Users },
  { to: "/university/form-builder", label: "Form Builder", icon: FileEdit },
  { to: "/university/form-config", label: "Form Config", icon: FileText },
  { to: "/university/announcements", label: "Announcements", icon: Bell },
  { to: "/university/blog", label: "Blog", icon: BookOpen },
  { to: "/university/bloggers", label: "Bloggers", icon: PenTool },
  { to: "/university/roll-numbers", label: "Roll Numbers", icon: Hash },
  { to: "/university/admission-letters", label: "Admission Letters", icon: ScrollText },
  { to: "/university/profile", label: "Profile", icon: User },
  { to: "/university/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/university/reports", label: "Reports", icon: Download },
  { to: "/university/scholarships", label: "Scholarships", icon: Wallet },
  { to: "/university/campaigns", label: "Campaigns", icon: Sparkles },
  { to: "/university/settings", label: "Settings", icon: Settings },
  { to: "/university/security", label: "Security", icon: Shield },
];

export const universityRoutePages = [
  { index: true, element: <UniversityOverviewPage /> },
  { path: "applications", element: <UniversityApplicationsPage /> },
  { path: "form-builder", element: <UniversityFormBuilderPage /> },
  { path: "form-config", element: <FormConfiguration /> },
  { path: "announcements", element: <UniversityAnnouncements /> },
  { path: "blog", element: <UniversityBlog /> },
  { path: "bloggers", element: <UniversityBloggerManagementPage /> },
  { path: "roll-numbers", element: <RollNumberManagement /> },
  { path: "admission-letters", element: <AdmissionLetterManagement /> },
  { path: "profile", element: <UniversityProfilePage /> },
  {
    path: "analytics",
    element: (
      <DashboardPlaceholderPage
        title="Admissions Analytics"
        subtitle="Measure program demand, conversion rates, and enrollment forecast trends."
        checklist={[
          "Cohort analytics by program and region",
          "Conversion funnel from application to enrollment",
          "Export-ready charts for management reviews",
        ]}
      />
    ),
  },
  {
    path: "reports",
    element: (
      <DashboardPlaceholderPage
        title="Reporting Center"
        subtitle="Generate PDF/Excel exports for management, accreditation, and audit use cases."
        checklist={[
          "Custom report templates",
          "Scheduled weekly/monthly report jobs",
          "Secure download history logs",
        ]}
      />
    ),
  },
  {
    path: "scholarships",
    element: (
      <DashboardPlaceholderPage
        title="Scholarship Configuration"
        subtitle="Configure need-based and merit-based scholarship rules and quotas."
        checklist={[
          "Policy-wise eligibility criteria",
          "Scholarship budget tracking",
          "Award approval workflows",
        ]}
      />
    ),
  },
  {
    path: "campaigns",
    element: (
      <DashboardPlaceholderPage
        title="Admission Campaigns"
        subtitle="Manage outreach campaigns, landing pages, and lead sources."
        checklist={[
          "Campaign performance dashboard",
          "Lead source attribution",
          "Open house event pipeline tracking",
        ]}
      />
    ),
  },
  { path: "settings", element: <UniversitySettings /> },
  {
    path: "security",
    element: (
      <DashboardPlaceholderPage
        title="University Security"
        subtitle="Control admin access, 2FA policies, and activity logging."
        checklist={[
          "Role permissions per department",
          "MFA and trusted device rules",
          "Audit logs for sensitive actions",
        ]}
      />
    ),
  },
];