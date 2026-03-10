import { AdminOverview } from "../../components/admin/AdminOverview";
import { DashboardPageShell } from "../shared/DashboardPageShell";
import { MetricGrid } from "../shared/MetricGrid";

const metrics = [
  { label: "Pending University Approvals", value: "03", trend: "Need immediate review" },
  { label: "Active Students", value: "12,540", trend: "+4.2% from last month" },
  { label: "Platform Uptime", value: "99.9%", trend: "Stable operations" },
  { label: "Security Alerts", value: "01", trend: "Resolved within SLA" },
];

export const AdminOverviewPage = () => {
  return (
    <DashboardPageShell
      title="System Administration"
      subtitle="Centralized governance for approvals, user management, and operational monitoring."
    >
      <MetricGrid metrics={metrics} />
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <AdminOverview />
      </div>
    </DashboardPageShell>
  );
};