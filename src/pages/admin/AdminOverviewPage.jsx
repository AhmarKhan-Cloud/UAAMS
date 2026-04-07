import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardPageShell } from "../shared/DashboardPageShell";
import { MetricGrid } from "../shared/MetricGrid";
import { api } from "../../lib/apiClient";
import { onDataUpdated } from "../../lib/socketClient";

export const AdminOverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true);
    }
    setError("");
    try {
      const response = await api.get("/admin/stats");
      setStats(response?.data || null);
    } catch (loadError) {
      setError(loadError?.message || "Unable to load admin dashboard stats.");
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadStats();
    const unsubscribe = onDataUpdated((event) => {
      if (
        ["applications", "announcements", "blogs", "bloggers", "programs", "universities"].includes(
          event?.resource,
        )
      ) {
        loadStats({ silent: true });
      }
    });
    return () => unsubscribe();
  }, [loadStats]);

  const metrics = useMemo(() => {
    if (!stats) {
      return [];
    }

    return [
      {
        label: "Pending University Approvals",
        value: String(stats.universities?.pendingApprovals || 0).padStart(2, "0"),
        trend: `${stats.universities?.total || 0} total universities`,
      },
      {
        label: "Active Students",
        value: Number(stats.users?.students || 0).toLocaleString(),
        trend: `${Number(stats.users?.bloggers || 0).toLocaleString()} bloggers`,
      },
      {
        label: "Applications in Review",
        value: Number(stats.applications?.inReview || 0).toLocaleString(),
        trend: `${Number(stats.applications?.total || 0).toLocaleString()} total applications`,
      },
      {
        label: "Published Content",
        value: Number(
          (stats.content?.blogPosts || 0) + (stats.content?.announcements || 0),
        ).toLocaleString(),
        trend: `${stats.content?.announcements || 0} announcements live`,
      },
    ];
  }, [stats]);

  const applicationChart = useMemo(
    () => [
      { name: "In Review", value: Number(stats?.applications?.inReview || 0) },
      { name: "Accepted", value: Number(stats?.applications?.accepted || 0) },
      { name: "Rejected", value: Number(stats?.applications?.rejected || 0) },
    ],
    [stats],
  );

  const userChart = useMemo(
    () => [
      { name: "Students", count: Number(stats?.users?.students || 0) },
      { name: "Bloggers", count: Number(stats?.users?.bloggers || 0) },
      { name: "Universities", count: Number(stats?.universities?.total || 0) },
    ],
    [stats],
  );

  return (
    <DashboardPageShell
      title="System Administration"
      subtitle="Centralized governance for approvals, user management, and platform operations."
    >
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
          Loading admin metrics...
        </div>
      ) : (
        <MetricGrid metrics={metrics} />
      )}

      {!isLoading && stats ? (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <article className="uaams-chart-card rounded-xl p-5">
              <h3 className="font-display mb-4 text-slate-900">Application Decisions</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={applicationChart}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="uaams-chart-card rounded-xl p-5">
              <h3 className="font-display mb-4 text-slate-900">User Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </article>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <StatPanel
              title="Universities"
              rows={[
                { label: "Total", value: stats.universities?.total || 0 },
                { label: "Pending", value: stats.universities?.pendingApprovals || 0 },
                { label: "Approved", value: stats.universities?.approved || 0 },
                { label: "Rejected", value: stats.universities?.rejected || 0 },
              ]}
            />
            <StatPanel
              title="Applications"
              rows={[
                { label: "Total", value: stats.applications?.total || 0 },
                { label: "In Review", value: stats.applications?.inReview || 0 },
                { label: "Accepted", value: stats.applications?.accepted || 0 },
                { label: "Rejected", value: stats.applications?.rejected || 0 },
              ]}
            />
            <StatPanel
              title="Content"
              rows={[
                { label: "Blog Posts", value: stats.content?.blogPosts || 0 },
                { label: "Announcements", value: stats.content?.announcements || 0 },
                { label: "Students", value: stats.users?.students || 0 },
                { label: "Bloggers", value: stats.users?.bloggers || 0 },
              ]}
            />
          </div>
        </>
      ) : null}
    </DashboardPageShell>
  );
};

function StatPanel({ title, rows }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-display mb-4 text-slate-900">{title}</h3>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{row.label}</span>
            <span className="text-slate-900">{Number(row.value || 0).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
