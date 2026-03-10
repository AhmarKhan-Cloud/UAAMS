import {Home,} from "lucide-react";
import { BloggerOverviewPage } from "../pages/blogger/BloggerOverviewPage";


export const bloggerNavItems = [
  { to: "/blogger", label: "Overview", icon: Home, end: true },
];

export const bloggerRoutePages = [
  { index: true, element: <BloggerOverviewPage /> },
];