import {
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  Folder,
  Home,
  MessageSquare,
  PenSquare,
  Tag,
  User,
} from "lucide-react";
import { DashboardPlaceholderPage } from "../pages/shared/DashboardPlaceholderPage";
import { BloggerCreatePostPage } from "../pages/blogger/BloggerCreatePostPage";
import { BloggerOverviewPage } from "../pages/blogger/BloggerOverviewPage";
import { BloggerPostsPage } from "../pages/blogger/BloggerPostsPage";

export const bloggerNavItems = [
  { to: "/blogger", label: "Overview", icon: Home, end: true },
  { to: "/blogger/posts", label: "Posts", icon: BookOpen },
  { to: "/blogger/create-post", label: "Create Post", icon: PenSquare },
  { to: "/blogger/media-library", label: "Media Library", icon: Folder },
  { to: "/blogger/categories", label: "Categories", icon: Tag },
  { to: "/blogger/comments", label: "Comments", icon: MessageSquare },
  { to: "/blogger/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/blogger/calendar", label: "Calendar", icon: Calendar },
  { to: "/blogger/notifications", label: "Notifications", icon: Bell },
  { to: "/blogger/profile", label: "Profile", icon: User },
];

export const bloggerRoutePages = [
  { index: true, element: <BloggerOverviewPage /> },
  { path: "posts", element: <BloggerPostsPage /> },
  { path: "create-post", element: <BloggerCreatePostPage /> },
  {
    path: "media-library",
    element: (
      <DashboardPlaceholderPage
        title="Media Library"
        subtitle="Store and organize branded media assets for blog campaigns."
        checklist={[
          "Tag-based media organization",
          "Image optimization for performance",
          "Permission controls per contributor",
        ]}
      />
    ),
  },
  {
    path: "categories",
    element: (
      <DashboardPlaceholderPage
        title="Content Categories"
        subtitle="Define topic taxonomy and maintain consistent post classification."
        checklist={[
          "Category templates for admission topics",
          "SEO keywords by category",
          "Editorial quality checklist",
        ]}
      />
    ),
  },
  {
    path: "comments",
    element: (
      <DashboardPlaceholderPage
        title="Comments Moderation"
        subtitle="Review and moderate comments with spam and abuse protection."
        checklist={[
          "Queued review workflows",
          "Keyword filtering and spam controls",
          "Moderator performance insights",
        ]}
      />
    ),
  },
  {
    path: "analytics",
    element: (
      <DashboardPlaceholderPage
        title="Blogger Analytics"
        subtitle="Measure post performance, read time, and referral channels."
        checklist={[
          "Top content by engagement",
          "Audience retention metrics",
          "Content conversion insights",
        ]}
      />
    ),
  },
  {
    path: "calendar",
    element: (
      <DashboardPlaceholderPage
        title="Editorial Calendar"
        subtitle="Plan weekly and monthly publishing schedule aligned with admission cycles."
        checklist={[
          "Drag-drop publishing calendar",
          "Reminder workflow for deadlines",
          "Contributor assignment tracking",
        ]}
      />
    ),
  },
  {
    path: "notifications",
    element: (
      <DashboardPlaceholderPage
        title="Notifications"
        subtitle="Stay informed about post approvals, comments, and performance spikes."
        checklist={[
          "Role-specific alerts",
          "Digest mode for daily insights",
          "Multi-channel delivery settings",
        ]}
      />
    ),
  },
  {
    path: "profile",
    element: (
      <DashboardPlaceholderPage
        title="Blogger Profile"
        subtitle="Manage identity, bio, and affiliation settings shown on published posts."
        checklist={[
          "Bio and expertise sections",
          "Social profile integration",
          "Verification and credibility badges",
        ]}
      />
    ),
  },
];