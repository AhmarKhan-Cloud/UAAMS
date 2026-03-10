import {BookOpen,Building2,Home,Users,} from "lucide-react";
import { AllBloggersManagement } from "../components/admin/AllBloggersManagement";
import { StudentManagement } from "../components/admin/StudentManagement";
import { UniversityManagement } from "../components/admin/UniversityManagement";
import { AdminOverviewPage } from "../pages/admin/AdminOverviewPage";

export const adminNavItems = [
  { to: "/admin", label: "Overview", icon: Home, end: true },
  { to: "/admin/universities", label: "Universities", icon: Building2 },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/bloggers", label: "Bloggers", icon: BookOpen },
];

export const adminRoutePages = [
  { index: true, element: <AdminOverviewPage /> },
  { path: "universities", element: <UniversityManagement /> },
  { path: "students", element: <StudentManagement /> },
  { path: "bloggers", element: <AllBloggersManagement /> },
  
];