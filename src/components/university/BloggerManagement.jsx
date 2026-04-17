import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { PasswordField } from "../shared/PasswordField";
import { api } from "../../lib/apiClient";
import { onDataUpdated } from "../../lib/socketClient";

const initialFormState = {
  name: "",
  email: "",
  username: "",
  phone: "",
  password: "",
};

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

function BloggerManagement() {
  const [bloggers, setBloggers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const [credentials, setCredentials] = useState(null);

  const loadBloggers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/universities/me/bloggers");
      const items = response?.data?.bloggers || [];
      setBloggers(items.map(normalizeBlogger));
    } catch (loadError) {
      setError(loadError?.message || "Unable to load bloggers.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBloggers();
    const unsubscribe = onDataUpdated((event) => {
      if (event?.resource === "bloggers") {
        loadBloggers();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const filteredBloggers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return bloggers.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.username.toLowerCase().includes(search);

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bloggers, searchTerm, statusFilter]);

  const stats = useMemo(
    () => ({
      total: bloggers.length,
      active: bloggers.filter((item) => item.status === "active").length,
      inactive: bloggers.filter((item) => item.status === "inactive").length,
    }),
    [bloggers]
  );

  const openCreateForm = () => {
    setShowForm(true);
    setFormData(initialFormState);
    setFormError("");
  };

  const closeCreateForm = () => {
    setShowForm(false);
    setFormData(initialFormState);
    setFormError("");
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setFormError("");
    setIsCreating(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        username: formData.username || undefined,
        phone: formData.phone,
        password: formData.password,
      };

      const response = await api.post("/universities/me/bloggers", payload);
      const createdBlogger = normalizeBlogger(response?.data?.blogger || {});
      const createdCredentials = response?.data?.credentials || null;
      const emailDelivery = response?.data?.emailDelivery || null;

      setBloggers((previous) => [createdBlogger, ...previous]);
      setCredentials(createdCredentials);
      setStatusMessage(
        emailDelivery?.sent
          ? "Blogger created and credential email sent."
          : emailDelivery?.reason || "Blogger created. Credential email could not be sent.",
      );
      closeCreateForm();
    } catch (createError) {
      setFormError(createError?.message || "Unable to create blogger.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleStatus = async (blogger) => {
    const nextStatus = blogger.status === "active" ? "inactive" : "active";
    try {
      const response = await api.patch(
        `/universities/me/bloggers/${blogger.id}/status`,
        { status: nextStatus }
      );
      const updated = normalizeBlogger(response?.data?.blogger || {});
      setBloggers((previous) =>
        previous.map((item) => (item.id === blogger.id ? { ...item, ...updated } : item))
      );
    } catch (statusError) {
      setError(statusError?.message || "Unable to update blogger status.");
    }
  };

  const handleDeleteBlogger = async (blogger) => {
    const shouldDelete = window.confirm(
      `Delete blogger account for ${blogger.name}? This action cannot be undone.`,
    );
    if (!shouldDelete) return;

    try {
      await api.del(`/universities/me/bloggers/${blogger.id}`);
      setBloggers((previous) => previous.filter((item) => item.id !== blogger.id));
      setStatusMessage("Blogger account deleted successfully.");
    } catch (deleteError) {
      setError(deleteError?.message || "Unable to delete blogger account.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-slate-900 mb-2">Blogger Management</h1>
          <p className="text-slate-600">Create and manage bloggers for your university.</p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Blogger
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <StatCard label="Total" count={stats.total} />
        <StatCard label="Active" count={stats.active} />
        <StatCard label="Inactive" count={stats.inactive} />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid md:grid-cols-2 gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search name, email, username"
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
      {statusMessage ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {statusMessage}
        </p>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Loading bloggers...
        </div>
      ) : null}

      {!isLoading && filteredBloggers.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
          No bloggers found.
        </div>
      ) : null}

      {!isLoading && filteredBloggers.length > 0 ? (
        <div className="space-y-4">
          {filteredBloggers.map((blogger) => (
            <article key={blogger.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-slate-900">{blogger.name}</h3>
                  <p className="text-sm text-slate-600">{blogger.email}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Username: {blogger.username || "N/A"} | Phone: {blogger.phone || "N/A"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Added: {formatDate(blogger.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
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
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                  >
                    {blogger.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBlogger(blogger)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-700 hover:bg-red-50 inline-flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6">
            <h2 className="text-slate-900 mb-4">Add Blogger</h2>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm text-slate-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, name: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, email: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm text-slate-700">Username (optional)</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, username: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData((previous) => ({ ...previous, phone: event.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-700">Password</label>
                <PasswordField
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((previous) => ({ ...previous, password: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoComplete="new-password"
                />
              </div>

              {formError ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {formError}
                </p>
              ) : null}

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={closeCreateForm}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-70"
                >
                  {isCreating ? "Creating..." : "Create Blogger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {credentials ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6">
            <h3 className="text-slate-900 mb-2">Blogger Credentials</h3>
            <p className="text-sm text-slate-600 mb-4">
              Credentials were sent via email. Save this backup as well.
            </p>

            <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div>
                <div className="text-xs text-slate-500">Username</div>
                <div className="text-sm text-slate-900">{credentials.username || "N/A"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Email</div>
                <div className="text-sm text-slate-900">{credentials.email || "N/A"}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Password</div>
                <div className="text-sm text-slate-900">{credentials.password || "N/A"}</div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setCredentials(null)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({ label, count }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="text-2xl text-slate-900">{count}</div>
    </div>
  );
}

export { BloggerManagement };
