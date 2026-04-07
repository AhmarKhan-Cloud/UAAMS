import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DashboardPageShell } from "../shared/DashboardPageShell";
import { MetricGrid } from "../shared/MetricGrid";
import { api } from "../../lib/apiClient";
import { onDataUpdated } from "../../lib/socketClient";

const quickLinks = [
  { label: "Complete Profile", to: "/student/profile" },
  { label: "Apply to Universities", to: "/student/recommendations" },
  { label: "Track Application Status", to: "/student/applications" },
  { label: "Read Merit Lists", to: "/student/merit-lists" },
];

const completionKeys = [
  "fullName",
  "email",
  "phone",
  "cnic",
  "address",
  "city",
  "matricObtainedMarks",
  "interObtainedMarks",
  "preferredPrograms",
  "preferredCities",
];

const calculateProfileCompletion = (profile) => {
  if (!profile) return 0;
  const completed = completionKeys.filter((key) => {
    const value = profile[key];
    if (Array.isArray(value)) return value.length > 0;
    return String(value || "").trim().length > 0;
  }).length;
  return Math.round((completed / completionKeys.length) * 100);
};

const formatMonth = (value) =>
  new Date(value).toLocaleString("en-US", { month: "short", year: "2-digit" });

export const StudentOverviewPage = () => {
  const [applications, setApplications] = useState([]);
  const [recommendationsCount, setRecommendationsCount] = useState(0);
  const [announcementsCount, setAnnouncementsCount] = useState(0);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true);
    }
    setError("");
    try {
      const [applicationsRes, recommendationsRes, announcementsRes, profileRes] = await Promise.all([
        api.get("/applications/me"),
        api.get("/students/recommendations"),
        api.get("/announcements?limit=200"),
        api.get("/students/me/profile"),
      ]);

      const nextApplications = applicationsRes?.data?.applications || [];
      const nextRecommendations = recommendationsRes?.data?.recommendations || [];
      const nextAnnouncements = announcementsRes?.data?.announcements || [];
      const profile = profileRes?.data?.profile || null;

      setApplications(nextApplications);
      setRecommendationsCount(nextRecommendations.length);
      setAnnouncementsCount(nextAnnouncements.length);
      setProfileCompletion(calculateProfileCompletion(profile));
    } catch (loadError) {
      setError(loadError?.message || "Unable to load student dashboard data.");
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadOverview();
    const unsubscribe = onDataUpdated((event) => {
      if (["applications", "announcements", "merit-lists", "programs"].includes(event?.resource)) {
        loadOverview({ silent: true });
      }
    });
    return () => unsubscribe();
  }, [loadOverview]);

  const metrics = useMemo(() => {
    const inProgress = applications.filter((item) =>
      ["pending", "under-review"].includes(item.status),
    ).length;
    const accepted = applications.filter((item) =>
      ["accepted", "assigned"].includes(item.status),
    ).length;

    return [
      {
        label: "Applications Submitted",
        value: String(applications.length).padStart(2, "0"),
        trend: `${inProgress} in review`,
      },
      {
        label: "Offers / Assigned",
        value: String(accepted).padStart(2, "0"),
        trend: "Accepted or roll-number assigned",
      },
      {
        label: "Recommendations",
        value: String(recommendationsCount),
        trend: "Based on profile match",
      },
      {
        label: "Profile Completion",
        value: `${profileCompletion}%`,
        trend: `${announcementsCount} announcements available`,
      },
    ];
  }, [applications, announcementsCount, profileCompletion, recommendationsCount]);

  const statusChartData = useMemo(() => {
    const statusMap = new Map([
      ["not-submitted", 0],
      ["pending", 0],
      ["under-review", 0],
      ["accepted", 0],
      ["rejected", 0],
      ["assigned", 0],
    ]);

    applications.forEach((item) => {
      statusMap.set(item.status, (statusMap.get(item.status) || 0) + 1);
    });

    return Array.from(statusMap.entries()).map(([status, count]) => ({
      status: status.replace("-", " "),
      count,
    }));
  }, [applications]);

  const timelineData = useMemo(() => {
    const map = new Map();
    applications.forEach((item) => {
      const date = new Date(item.createdAt || item.appliedAt || Date.now());
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const current = map.get(key) || { month: formatMonth(date), submissions: 0 };
      map.set(key, { ...current, submissions: current.submissions + 1 });
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([, value]) => value);
  }, [applications]);

  return (
    <DashboardPageShell
      title="Student Command Center"
      subtitle="One dashboard to manage profile completion, applications, deadlines, and merit insights."
    >
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
          Loading dashboard metrics...
        </div>
      ) : (
        <MetricGrid metrics={metrics} />
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="uaams-chart-card rounded-xl p-5">
          <h2 className="font-display text-lg text-slate-900">Application Status (Realtime)</h2>
          <p className="mb-4 text-xs text-slate-500">Auto-refreshes when status changes.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="uaams-chart-card rounded-xl p-5">
          <h2 className="font-display text-lg text-slate-900">Submission Timeline</h2>
          <p className="mb-4 text-xs text-slate-500">Monthly application draft/submission activity.</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="studentSubmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0.08} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="submissions"
                  stroke="#22c55e"
                  fill="url(#studentSubmissions)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="font-display text-slate-900">Quick Actions</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {quickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </article>
    </DashboardPageShell>
  );
};
