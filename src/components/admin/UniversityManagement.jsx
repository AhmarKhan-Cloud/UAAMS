import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/apiClient";

const normalizeUniversity = (item) => ({
  id: String(item?._id || item?.id || ""),
  name: item?.profile?.universityName || item?.name || "University",
  email: item?.email || item?.profile?.email || "",
  location: item?.location || item?.profile?.city || "N/A",
  representative: item?.representativeName || item?.profile?.representativeName || "N/A",
  website: item?.website || item?.profile?.website || "",
  established: item?.profile?.established || item?.establishedYear || "",
  approvalStatus: item?.approvalStatus || "pending",
  status: item?.status || "active",
  createdAt: item?.createdAt || null,
  bloggerCount: Number(item?.bloggerCount || 0),
  applicationStats: item?.applicationStats || {
    total: 0,
    pending: 0,
    underReview: 0,
    accepted: 0,
    rejected: 0,
    assigned: 0,
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

function UniversityManagement() {
  const [universities, setUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeId, setActiveId] = useState("");

  const loadUniversities = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("limit", "200");
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (searchTerm.trim()) params.set("search", searchTerm.trim());

      const response = await api.get(`/admin/universities/management?${params.toString()}`);
      const items = response?.data?.items || [];
      setUniversities(items.map(normalizeUniversity));
    } catch (loadError) {
      setError(loadError?.message || "Unable to load universities.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadUniversities();
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      total: universities.length,
      pending: universities.filter((item) => item.approvalStatus === "pending").length,
      approved: universities.filter((item) => item.approvalStatus === "approved").length,
      rejected: universities.filter((item) => item.approvalStatus === "rejected").length,
    }),
    [universities]
  );

  const handleReview = async (universityId, approvalStatus) => {
    setActiveId(`${universityId}-review`);
    setError("");
    try {
      await api.patch(`/admin/universities/${universityId}/review`, { approvalStatus });
      setUniversities((previous) =>
        previous.map((item) =>
          item.id === universityId ? { ...item, approvalStatus } : item
        )
      );
    } catch (reviewError) {
      setError(reviewError?.message || "Unable to update approval status.");
    } finally {
      setActiveId("");
    }
  };

  const handleToggleUserStatus = async (university) => {
    const nextStatus = university.status === "active" ? "inactive" : "active";
    setActiveId(`${university.id}-status`);
    setError("");
    try {
      await api.patch(`/admin/users/${university.id}/status`, { status: nextStatus });
      setUniversities((previous) =>
        previous.map((item) =>
          item.id === university.id ? { ...item, status: nextStatus } : item
        )
      );
    } catch (statusError) {
      setError(statusError?.message || "Unable to update university status.");
    } finally {
      setActiveId("");
    }
  };

  const handleDeleteUniversity = async (university) => {
    const confirmed = window.confirm(
      `Delete university "${university.name}"?\nThis will remove related applications, bloggers, programs, and content.`,
    );
    if (!confirmed) return;

    setActiveId(`${university.id}-delete`);
    setError("");
    try {
      await api.del(`/admin/users/${university.id}`);
      setUniversities((previous) => previous.filter((item) => item.id !== university.id));
    } catch (deleteError) {
      setError(deleteError?.message || "Unable to delete university.");
    } finally {
      setActiveId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">University Management</h1>
        <p className="text-slate-600">Review university approvals and platform status.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Approved" value={stats.approved} />
        <StatCard label="Rejected" value={stats.rejected} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, email, location"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Approval States</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
          Loading universities...
        </div>
      ) : null}

      {!isLoading && universities.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          No universities found.
        </div>
      ) : null}

      {!isLoading && universities.length > 0 ? (
        <div className="space-y-4">
          {universities.map((university) => (
            <article key={university.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-slate-900">{university.name}</h3>
                  <p className="text-sm text-slate-600">{university.email}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {university.location} | Representative: {university.representative}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Registered: {formatDate(university.createdAt)} | Applications:{" "}
                    {university.applicationStats?.total || 0} | Bloggers: {university.bloggerCount}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      university.approvalStatus === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : university.approvalStatus === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {university.approvalStatus}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      university.status === "active"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {university.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
                {university.approvalStatus === "pending" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReview(university.id, "approved")}
                      disabled={Boolean(activeId)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white hover:bg-emerald-700 disabled:opacity-70"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReview(university.id, "rejected")}
                      disabled={Boolean(activeId)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs text-white hover:bg-red-700 disabled:opacity-70"
                    >
                      Reject
                    </button>
                  </>
                ) : null}

                <button
                  type="button"
                  onClick={() => handleToggleUserStatus(university)}
                  disabled={Boolean(activeId)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-70"
                >
                  {university.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteUniversity(university)}
                  disabled={Boolean(activeId)}
                  className="rounded-lg border border-red-300 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 disabled:opacity-70"
                >
                  Delete
                </button>
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

export { UniversityManagement };
