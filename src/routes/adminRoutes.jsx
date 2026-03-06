import {
  Activity,
  Bell,
  BookOpen,
  Building2,
  Home,
  LineChart,
  Lock,
  Settings,
  Shield,
  UserCheck,
  Users,
  Workflow,
} from "lucide-react";
import { AllBloggersManagement } from "../components/AllBloggersManagement";
import { StudentManagement } from "../components/StudentManagement";
import { UniversityManagement } from "../components/UniversityManagement";
import { DashboardPlaceholderPage } from "../pages/shared/DashboardPlaceholderPage";
import { AdminOverviewPage } from "../pages/admin/AdminOverviewPage";

export const adminNavItems = [
  { to: "/admin", label: "Overview", icon: Home, end: true },
  { to: "/admin/universities", label: "Universities", icon: Building2 },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/bloggers", label: "Bloggers", icon: BookOpen },
  { to: "/admin/approvals", label: "Approvals", icon: UserCheck },
  { to: "/admin/analytics", label: "Analytics", icon: LineChart },
  { to: "/admin/audit-logs", label: "Audit Logs", icon: Activity },
  { to: "/admin/announcements", label: "Announcements", icon: Bell },
  { to: "/admin/roles", label: "Roles", icon: Workflow },
  { to: "/admin/security", label: "Security", icon: Lock },
  { to: "/admin/system-settings", label: "System", icon: Settings },
  { to: "/admin/compliance", label: "Compliance", icon: Shield },
];

export const adminRoutePages = [
  { index: true, element: <AdminOverviewPage /> },
  { path: "universities", element: <UniversityManagement /> },
  { path: "students", element: <StudentManagement /> },
  { path: "bloggers", element: <AllBloggersManagement /> },
  {
    path: "approvals",
    element: (
      <DashboardPlaceholderPage
        title="Approvals Queue"
        subtitle="Review pending organization and account approvals with audit-ready traceability."
        checklist={[
          "University verification checklist",
          "Risk scoring for suspicious entries",
          "Approval SLA monitoring",
        ]}
      />
    ),
  },
  {
    path: "analytics",
    element: (
      <DashboardPlaceholderPage
        title="Platform Analytics"
        subtitle="Executive dashboards for platform usage, growth, and service quality KPIs."
        checklist={[
          "Daily active user trends",
          "Role-wise conversion funnels",
          "Infrastructure and incident metrics",
        ]}
      />
    ),
  },
  {
    path: "audit-logs",
    element: (
      <DashboardPlaceholderPage
        title="Audit Logs"
        subtitle="Trace sensitive actions by role, timestamp, and affected records."
        checklist={[
          "Immutable activity timeline",
          "Filters by role, action, and date",
          "Incident investigation exports",
        ]}
      />
    ),
  },
  {
    path: "announcements",
    element: (
      <DashboardPlaceholderPage
        title="System Announcements"
        subtitle="Broadcast platform notices, maintenance windows, and policy updates."
        checklist={[
          "Audience segmentation by role",
          "Scheduled publishing and expiry",
          "Read receipt tracking",
        ]}
      />
    ),
  },
  {
    path: "roles",
    element: (
      <DashboardPlaceholderPage
        title="Roles and Permissions"
        subtitle="Define fine-grained permissions for secure multi-role governance."
        checklist={[
          "Permission matrix editor",
          "Template roles by department",
          "Change history with rollback",
        ]}
      />
    ),
  },
  {
    path: "security",
    element: (
      <DashboardPlaceholderPage
        title="Security Center"
        subtitle="Manage authentication hardening, policy enforcement, and threat controls."
        checklist={[
          "MFA policy controls",
          "Suspicious login detection",
          "Password policy and lockout settings",
        ]}
      />
    ),
  },
  {
    path: "system-settings",
    element: (
      <DashboardPlaceholderPage
        title="System Settings"
        subtitle="Global controls for branding, communications, and operational defaults."
        checklist={[
          "Platform configuration management",
          "Email/SMS provider settings",
          "Backup and restore options",
        ]}
      />
    ),
  },
  {
    path: "compliance",
    element: (
      <DashboardPlaceholderPage
        title="Compliance"
        subtitle="Monitor governance standards, privacy controls, and regulatory readiness."
        checklist={[
          "Data retention rules",
          "Consent and privacy controls",
          "Compliance report generation",
        ]}
      />
    ),
  },
];