import {Bell,BookOpen,FileEdit,Hash,Home,PenTool,ScrollText,Settings,Users,} from "lucide-react";
import { AdmissionLetterManagement } from "../components/university/AdmissionLetterManagement";
import { FormConfiguration } from "../components/university/FormConfiguration";
import { RollNumberManagement } from "../components/university/RollNumberManagement";
import { UniversityAnnouncements } from "../components/university/UniversityAnnouncements";
import { UniversityBlog } from "../components/university/UniversityBlog";
import { UniversitySettings } from "../components/university/UniversitySettings";
import { UniversityApplicationsPage } from "../pages/university/UniversityApplicationsPage";
import { UniversityBloggerManagementPage } from "../pages/university/UniversityBloggerManagementPage";
import { UniversityOverviewPage } from "../pages/university/UniversityOverviewPage";

export const universityNavItems = [
  { to: "/university", label: "Overview", icon: Home, end: true },
  { to: "/university/applications", label: "Applications", icon: Users },
  { to: "/university/form-builder", label: "Form & Programs", icon: FileEdit },
  { to: "/university/announcements", label: "Announcements", icon: Bell },
  { to: "/university/blog", label: "Blog", icon: BookOpen },
  { to: "/university/bloggers", label: "Bloggers", icon: PenTool },
  { to: "/university/roll-numbers", label: "Roll Numbers", icon: Hash },
  { to: "/university/admission-letters", label: "Admission Letters", icon: ScrollText },
  { to: "/university/settings", label: "Profile & Settings", icon: Settings },

];

export const universityRoutePages = [
  { index: true, element: <UniversityOverviewPage /> },
  { path: "applications", element: <UniversityApplicationsPage /> },
  { path: "form-builder", element: <FormConfiguration /> },
  { path: "form-config", element: <FormConfiguration /> },
  { path: "announcements", element: <UniversityAnnouncements /> },
  { path: "blog", element: <UniversityBlog /> },
  { path: "bloggers", element: <UniversityBloggerManagementPage /> },
  { path: "roll-numbers", element: <RollNumberManagement /> },
  { path: "admission-letters", element: <AdmissionLetterManagement /> },
  { path: "profile", element: <UniversitySettings /> },
  { path: "settings", element: <UniversitySettings /> },
];
