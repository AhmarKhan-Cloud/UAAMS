import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/apiClient";

const normalizeBlogger = (item) => ({
  id: String(item?._id || item?.id || ""),
  name: item?.name || "",
  email: item?.email || "",
  username: item?.username || "",
  phone: item?.phone || "",
  status: item?.status || "active",
  managedUniversity:
    typeof item?.managedUniversity === "object"
      ? item.managedUniversity?.name || ""
      : "",
  createdAt: item?.createdAt || null,
  postStats: item?.postStats || {
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
  },
});

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function AllBloggersManagement() {
  const [bloggers, setBloggers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeId, setActiveId] = useState("");

  const loadBloggers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("limit", "200");
      if (searchTerm.trim()) params.set("search", searchTerm.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);

      const response = await api.get(`/admin/bloggers/management?${params.toString()}`);
      const items = response?.data?.items || [];
      setBloggers(items.map(normalizeBlogger));
    } catch (loadError) {
      setError(loadError?.message || "Unable to load bloggers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadBloggers();
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      total: bloggers.length,
      active: bloggers.filter((item) => item.status === "active").length,
      inactive: bloggers.filter((item) => item.status === "inactive").length,
      posts: bloggers.reduce((sum, item) => sum + Number(item.postStats?.totalPosts || 0), 0),
      views: bloggers.reduce((sum, item) => sum + Number(item.postStats?.totalViews || 0), 0),
    }),
    [bloggers]
  );

  const handleToggleStatus = async (blogger) => {
    const nextStatus = blogger.status === "active" ? "inactive" : "active";
    setActiveId(blogger.id);
    setError("");
    try {
      await api.patch(`/admin/users/${blogger.id}/status`, { status: nextStatus });
      setBloggers((previous) =>
        previous.map((item) =>
          item.id === blogger.id ? { ...item, status: nextStatus } : item
        )
      );
    } catch (statusError) {
      setError(statusError?.message || "Unable to update blogger status.");
    } finally {
      setActiveId("");
    }
  };

  const handleDeleteBlogger = async (blogger) => {
    const confirmed = window.confirm(
      `Delete blogger "${blogger.name}"?\nThis will remove the account and blog posts created by this blogger.`,
    );
    if (!confirmed) return;

    setActiveId(`${blogger.id}-delete`);
    setError("");
    try {
      await api.del(`/admin/users/${blogger.id}`);
      setBloggers((previous) => previous.filter((item) => item.id !== blogger.id));
    } catch (deleteError) {
      setError(deleteError?.message || "Unable to delete blogger.");
    } finally {
      setActiveId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">Bloggers Management</h1>
        <p className="text-slate-600">Manage blogger accounts across all universities.</p>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Inactive" value={stats.inactive} />
        <StatCard label="Total Posts" value={stats.posts} />
        <StatCard label="Total Views" value={stats.views.toLocaleString()} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search name, email, username, university"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Loading bloggers...
        </div>
      ) : null}

      {!isLoading && bloggers.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          No bloggers found.
        </div>
      ) : null}

      {!isLoading && bloggers.length > 0 ? (
        <div className="space-y-4">
          {bloggers.map((blogger) => (
            <article key={blogger.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-slate-900">{blogger.name}</h3>
                  <p className="text-sm text-slate-600">{blogger.email}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Username: {blogger.username || "N/A"} | University:{" "}
                    {blogger.managedUniversity || "N/A"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Added: {formatDate(blogger.createdAt)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge label="Posts" value={blogger.postStats?.totalPosts || 0} />
                    <Badge label="Published" value={blogger.postStats?.publishedPosts || 0} />
                    <Badge label="Drafts" value={blogger.postStats?.draftPosts || 0} />
                    <Badge
                      label="Views"
                      value={Number(blogger.postStats?.totalViews || 0).toLocaleString()}
                    />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      blogger.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {blogger.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(blogger)}
                    disabled={Boolean(activeId)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-70"
                  >
                    {blogger.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlogger(blogger)}
                    disabled={Boolean(activeId)}
                    className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-70"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-2xl text-slate-900">{value}</div>
    </div>
  );
}

function Badge({ label, value }) {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
      {label}: {value}
    </span>
  );
}

export { AllBloggersManagement };
