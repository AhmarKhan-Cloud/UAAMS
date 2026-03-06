import { Link } from "react-router-dom";
import { DashboardPageShell } from "../shared/DashboardPageShell";
import { MetricGrid } from "../shared/MetricGrid";

const metrics = [
  { label: "Published Posts", value: "32", trend: "+3 this month" },
  { label: "Drafts", value: "06", trend: "2 need review" },
  { label: "Total Views", value: "48.2K", trend: "+14% audience growth" },
  { label: "Engagement", value: "8.4%", trend: "Above benchmark" },
];

const workflow = [
  { label: "Create New Post", to: "/blogger/create-post" },
  { label: "Manage Published Posts", to: "/blogger/posts" },
  { label: "Track Analytics", to: "/blogger/analytics" },
  { label: "Moderate Comments", to: "/blogger/comments" },
];

export const BloggerOverviewPage = () => {
  return (
    <DashboardPageShell
      title="Blogger Studio"
      subtitle="Plan, write, and publish high-quality admission guidance content with analytics insights."
    >
      <MetricGrid metrics={metrics} />

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-slate-900">Publishing Workflow</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {workflow.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </DashboardPageShell>
  );
};