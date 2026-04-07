import { Home, KeyRound } from "lucide-react";
import { BloggerOverviewPage } from "../pages/blogger/BloggerOverviewPage";
import { BloggerPasswordPage } from "../pages/blogger/BloggerPasswordPage";

export const bloggerNavItems = [
  { to: "/blogger", label: "Overview", icon: Home, end: true },
  { to: "/blogger/password", label: "Password", icon: KeyRound },
];

export const bloggerRoutePages = [
  { index: true, element: <BloggerOverviewPage /> },
  { path: "password", element: <BloggerPasswordPage /> },
];
