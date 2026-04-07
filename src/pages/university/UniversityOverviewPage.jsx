import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import { useAuth } from "../../context/AuthContext";
import { onDataUpdated } from "../../lib/socketClient";

const routeMap = {
  applications: "/university/applications",
  announcements: "/university/announcements",
  "roll-numbers": "/university/roll-numbers",
  "form-builder": "/university/form-builder",
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export const UniversityOverviewPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [announcementsCount, setAnnouncementsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOverview = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true);
    }
    setError("");
    try {
      const requests = [
        api.get("/applications/university/me?limit=200"),
        api.get("/universities/me/profile"),
      ];

      if (currentUser?.id) {
        requests.push(api.get(`/announcements/university/${currentUser.id}`));
      }

      const [applicationsRes, profileRes, announcementsRes] = await Promise.all(requests);
      setApplications(applicationsRes?.data?.applications || []);
      setProfile(profileRes?.data?.profile || null);
      setAnnouncementsCount((announcementsRes?.data?.announcements || []).length);
    } catch (loadError) {
      setError(loadError?.message || "Unable to load university dashboard data.");
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, [currentUser?.id]);

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
    const pending = applications.filter((item) => item.status === "pending").length;
    const underReview = applications.filter((item) => item.status === "under-review").length;
    const accepted = applications.filter((item) =>
      ["accepted", "assigned"].includes(item.status),
    ).length;
    const activePrograms = Array.isArray(profile?.programs)
      ? profile.programs.length
      : Number(profile?.totalPrograms || 0);

    return [
      {
        label: "Total Applications",
        value: String(applications.length),
        trend: `${pending + underReview} pending review`,
      },
      {
        label: "Accepted / Assigned",
        value: String(accepted),
        trend: "Successful admissions",
      },
      {
        label: "Announcements",
        value: String(announcementsCount),
        trend: "Published for applicants",
      },
      {
        label: "Programs Active",
        value: String(activePrograms || 0),
        trend: `Application fee PKR ${Number(profile?.applicationFee || 0).toLocaleString()}`,
      },
    ];
  }, [announcementsCount, applications, profile?.applicationFee, profile?.programs, profile?.totalPrograms]);

  const recentApplications = useMemo(
    () =>
      applications
        .slice()
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5),
    [applications],
  );

  const applicationsByProgram = useMemo(() => {
    const map = new Map();
    applications.forEach((application) => {
      const program = application.program || "Unspecified";
      map.set(program, (map.get(program) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([program, count]) => ({ program, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [applications]);

  const statusChartData = useMemo(() => {
    const statuses = ["pending", "under-review", "accepted", "rejected", "assigned"];
    return statuses.map((status) => ({
      name: status.replace("-", " "),
      value: applications.filter((item) => item.status === status).length,
    }));
  }, [applications]);

  const statusColors = ["#0ea5e9", "#f59e0b", "#22c55e", "#ef4444", "#6366f1"];

  return (
    <DashboardPageShell
      title="University Dashboard"
      subtitle="Manage admissions and applications from one central location."
    >
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
          Loading dashboard metrics...
        </div>
      ) : (
        <MetricGrid metrics={metrics} />
      )}

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="uaams-chart-card rounded-xl p-5">
          <h3 className="font-display mb-4 text-slate-900">Applications by Program (Realtime)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={applicationsByProgram}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="program" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="uaams-chart-card rounded-xl p-5">
          <h3 className="font-display mb-4 text-slate-900">Application Status Split</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  nameKey="name"
                  label
                >
                  {statusChartData.map((item, index) => (
                    <Cell key={`${item.name}-${index}`} fill={statusColors[index % statusColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-display mb-4 text-slate-900">Recent Applications</h3>
          {recentApplications.length === 0 ? (
            <p className="text-sm text-slate-600">No applications received yet.</p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((item) => (
                <div key={item._id} className="rounded-lg bg-slate-50 p-3">
                  <div className="text-sm text-slate-900">{item.studentName}</div>
                  <div className="text-xs text-slate-600">{item.program}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {item.status} | {formatDate(item.appliedAt || item.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => navigate(routeMap.applications)}
            className="mt-4 text-blue-600 hover:text-blue-700 text-sm"
          >
            View all applications {"->"}
          </button>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6">
          <h3 className="font-display mb-4 text-slate-900">Top Programs by Applications</h3>
          {applicationsByProgram.length === 0 ? (
            <p className="text-sm text-slate-600">Program distribution will appear once applications are submitted.</p>
          ) : (
            <div className="space-y-3">
              {applicationsByProgram.map((item) => (
                <div key={item.program}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700">{item.program}</span>
                    <span className="text-slate-600">{item.count}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width: `${Math.max(8, Math.round((item.count / Math.max(applications.length, 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <ActionCard
          title="Publish Announcement"
          description="Share important updates with applicants."
          buttonText="Create Announcement"
          onClick={() => navigate(routeMap.announcements)}
        />
        <ActionCard
          title="Upload Roll Numbers"
          description="Assign roll numbers and share slips with students."
          buttonText="Manage Roll Numbers"
          onClick={() => navigate(routeMap["roll-numbers"])}
        />
        <ActionCard
          title="Configure Forms"
          description="Update admission form fields, programs, and fee."
          buttonText="Manage Form"
          onClick={() => navigate(routeMap["form-builder"])}
        />
      </div>
    </DashboardPageShell>
  );
};

function ActionCard({ title, description, buttonText, onClick }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-md">
      <h3 className="font-display mb-2 text-slate-900">{title}</h3>
      <p className="text-slate-600 text-sm mb-4">{description}</p>
      <button
        onClick={onClick}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        {buttonText}
      </button>
    </div>
  );
}
