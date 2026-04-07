import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/apiClient";

const normalizeStudent = (item) => ({
  id: String(item?._id || item?.id || ""),
  name: item?.name || "",
  email: item?.email || "",
  phone: item?.phone || item?.profile?.phone || "",
  city: item?.location || item?.profile?.city || "",
  status: item?.status || "active",
  createdAt: item?.createdAt || null,
  profile: item?.profile || null,
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

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeId, setActiveId] = useState("");

  const loadStudents = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.set("limit", "200");
      if (searchTerm.trim()) params.set("search", searchTerm.trim());

      const response = await api.get(`/admin/students/management?${params.toString()}`);
      const items = response?.data?.items || [];
      setStudents(items.map(normalizeStudent));
    } catch (loadError) {
      setError(loadError?.message || "Unable to load students.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadStudents();
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const filteredStudents = useMemo(() => {
    if (statusFilter === "all") return students;
    return students.filter((item) => item.status === statusFilter);
  }, [students, statusFilter]);

  const stats = useMemo(
    () => ({
      total: students.length,
      active: students.filter((item) => item.status === "active").length,
      inactive: students.filter((item) => item.status === "inactive").length,
      applications: students.reduce(
        (sum, item) => sum + Number(item.applicationStats?.total || 0),
        0
      ),
    }),
    [students]
  );

  const handleToggleStatus = async (student) => {
    const nextStatus = student.status === "active" ? "inactive" : "active";
    setActiveId(student.id);
    setError("");
    try {
      await api.patch(`/admin/users/${student.id}/status`, { status: nextStatus });
      setStudents((previous) =>
        previous.map((item) =>
          item.id === student.id ? { ...item, status: nextStatus } : item
        )
      );
    } catch (statusError) {
      setError(statusError?.message || "Unable to update student status.");
    } finally {
      setActiveId("");
    }
  };

  const handleDeleteStudent = async (student) => {
    const confirmed = window.confirm(
      `Delete student "${student.name}"?\nThis will remove the account and related records.`,
    );
    if (!confirmed) return;

    setActiveId(`${student.id}-delete`);
    setError("");
    try {
      await api.del(`/admin/users/${student.id}`);
      setStudents((previous) => previous.filter((item) => item.id !== student.id));
    } catch (deleteError) {
      setError(deleteError?.message || "Unable to delete student.");
    } finally {
      setActiveId("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">Student Management</h1>
        <p className="text-slate-600">Monitor student profiles and account status.</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats.total} />
        <StatCard label="Active" value={stats.active} />
        <StatCard label="Inactive" value={stats.inactive} />
        <StatCard label="Applications" value={stats.applications} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, email, city"
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
          Loading students...
        </div>
      ) : null}

      {!isLoading && filteredStudents.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          No students found.
        </div>
      ) : null}

      {!isLoading && filteredStudents.length > 0 ? (
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <article key={student.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-slate-900">{student.name}</h3>
                  <p className="text-sm text-slate-600">{student.email}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Phone: {student.phone || "N/A"} | City: {student.city || "N/A"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Registered: {formatDate(student.createdAt)} | Applications:{" "}
                    {student.applicationStats?.total || 0}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge label="Pending" value={student.applicationStats?.pending || 0} />
                    <Badge
                      label="Under Review"
                      value={student.applicationStats?.underReview || 0}
                    />
                    <Badge label="Accepted" value={student.applicationStats?.accepted || 0} />
                    <Badge label="Rejected" value={student.applicationStats?.rejected || 0} />
                    <Badge label="Assigned" value={student.applicationStats?.assigned || 0} />
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      student.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {student.status}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(student)}
                    disabled={Boolean(activeId)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 disabled:opacity-70"
                  >
                    {student.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteStudent(student)}
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

export { StudentManagement };
