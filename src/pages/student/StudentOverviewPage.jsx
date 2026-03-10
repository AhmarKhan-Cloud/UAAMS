import { Link } from "react-router-dom";
import { DashboardPageShell } from "../shared/DashboardPageShell";
import { MetricGrid } from "../shared/MetricGrid";

const metrics = [
  { label: "Applications Submitted", value: "08", trend: "+2 this week" },
  { label: "Recommendations", value: "24", trend: "Based on profile match" },
  { label: "Announcements", value: "11", trend: "3 unread" },
  { label: "Merit Positions", value: "05", trend: "Updated this morning" },
];

const quickLinks = [
  { label: "Complete Profile", to: "/student/profile" },
  { label: "Apply to Universities", to: "/student/recommendations" },
  { label: "Track Application Status", to: "/student/applications" },
  { label: "Read Merit Lists", to: "/student/merit-lists" },
];

export const StudentOverviewPage = () => {
  return (
    <DashboardPageShell
      title="Student Command Center"
      subtitle="One dashboard to manage profile completion, applications, deadlines, and merit insights."
    >
      <MetricGrid metrics={metrics} />

      <div className="grid gap-4">
        <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-slate-900 ">Quick Actions</h2>
          <div className="mt-3 grid gap-2">
            {quickLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </article>


      </div>
    </DashboardPageShell>
  );
};