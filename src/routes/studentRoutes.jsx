import {Award,Bell,BookOpen,FileText,Home,TrendingUp,User,} from "lucide-react";
import { Announcements } from "../components/student/Announcements";
import { MeritLists } from "../components/student/MeritLists";
import { MyApplications } from "../components/student/MyApplications";
import { StudentBlog } from "../components/student/StudentBlog";
import { UniversityRecommendations } from "../components/student/UniversityRecommendations";
import { StudentOverviewPage } from "../pages/student/StudentOverviewPage";
import { StudentProfilePage } from "../pages/student/StudentProfilePage";

export const studentNavItems = [
  { to: "/student", label: "Overview", icon: Home, end: true },
  { to: "/student/profile", label: "Profile", icon: User },
  { to: "/student/recommendations", label: "Recommendations", icon: TrendingUp },
  { to: "/student/applications", label: "Applications", icon: FileText },
  { to: "/student/merit-lists", label: "Merit Lists", icon: Award },
  { to: "/student/announcements", label: "Announcements", icon: Bell },
  { to: "/student/blog", label: "Blog", icon: BookOpen },
];

export const studentRoutePages = [
  { index: true, element: <StudentOverviewPage /> },
  { path: "profile", element: <StudentProfilePage /> },
  { path: "recommendations", element: <UniversityRecommendations /> },
  { path: "applications", element: <MyApplications /> },
  { path: "merit-lists", element: <MeritLists /> },
  { path: "announcements", element: <Announcements /> },
  { path: "blog", element: <StudentBlog /> },
];