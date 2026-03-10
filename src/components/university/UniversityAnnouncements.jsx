import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Bell } from "lucide-react";
const mockAnnouncements = [
  {
    id: "1",
    title: "Fall 2025 Admissions Open",
    content: "Applications for Fall 2025 session are now open for all undergraduate programs. NET-I test will be conducted on June 15, 2025. Last date to apply is June 10, 2025.",
    type: "deadline",
    category: "Admissions",
    publishedDate: "May 13, 2025",
    status: "published"
  },
  {
    id: "2",
    title: "Fee Structure for 2025 Released",
    content: "Updated fee structure for all undergraduate programs is now available. Financial assistance options are also available for eligible students.",
    type: "general",
    category: "Fee Information",
    publishedDate: "May 10, 2025",
    status: "published"
  },
  {
    id: "3",
    title: "Second Merit List - Draft",
    content: "Preparing second merit list for Computer Science and Electrical Engineering programs.",
    type: "merit-list",
    category: "Merit Lists",
    publishedDate: "May 15, 2025",
    status: "draft"
  }
];
function UniversityAnnouncements() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const filteredAnnouncements = announcements.filter((announcement) => {
    if (selectedFilter === "all") return true;
    return announcement.status === selectedFilter;
  });
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      setAnnouncements(announcements.filter((a) => a.id !== id));
    }
  };
  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
  };
  const handleUpdate = (updatedAnnouncement) => {
    setAnnouncements(announcements.map(
      (a) => a.id === updatedAnnouncement.id ? updatedAnnouncement : a
    ));
    setEditingAnnouncement(null);
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-slate-900 mb-2">Announcements</h1>
          <p className="text-slate-600">Manage university announcements and updates</p>
        </div>
        <button
    onClick={() => setShowAddModal(true)}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
          <Plus className="w-4 h-4" />
          Create Announcement
        </button>
      </div>

      {
    /* Filter */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex gap-2">
          <FilterButton
    label="All"
    active={selectedFilter === "all"}
    onClick={() => setSelectedFilter("all")}
  />
          <FilterButton
    label="Published"
    active={selectedFilter === "published"}
    onClick={() => setSelectedFilter("published")}
  />
          <FilterButton
    label="Drafts"
    active={selectedFilter === "draft"}
    onClick={() => setSelectedFilter("draft")}
  />
        </div>
      </div>

      {
    /* Stats */
  }
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
    label="Total Announcements"
    count={announcements.length}
    color="bg-blue-50 text-blue-600"
  />
        <StatCard
    label="Published"
    count={announcements.filter((a) => a.status === "published").length}
    color="bg-emerald-50 text-emerald-600"
  />
        <StatCard
    label="Drafts"
    count={announcements.filter((a) => a.status === "draft").length}
    color="bg-amber-50 text-amber-600"
  />
      </div>

      {
    /* Announcements List */
  }
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => <AnnouncementCard
    key={announcement.id}
    announcement={announcement}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />)}
      </div>

      {
    /* Add Announcement Modal */
  }
      {showAddModal && <AddAnnouncementModal
    onClose={() => setShowAddModal(false)}
    onAdd={(announcement) => {
      setAnnouncements([
        ...announcements,
        { ...announcement, id: Date.now().toString() }
      ]);
      setShowAddModal(false);
    }}
  />}

      {
    /* Edit Announcement Modal */
  }
      {editingAnnouncement && <AddAnnouncementModal
    announcement={editingAnnouncement}
    onClose={() => setEditingAnnouncement(null)}
    onAdd={handleUpdate}
  />}
    </div>;
}
function FilterButton({
  label,
  active,
  onClick
}) {
  return <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-colors ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
  >
      {label}
    </button>;
}
function StatCard({ label, count, color }) {
  return <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="text-slate-600 text-sm mb-1">{label}</div>
      <div className={`text-3xl ${color}`}>{count}</div>
    </div>;
}
function AnnouncementCard({
  announcement,
  onEdit,
  onDelete
}) {
  const getTypeStyles = () => {
    switch (announcement.type) {
      case "deadline":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          icon: <Calendar className="w-5 h-5" />
        };
      case "urgent":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: <Bell className="w-5 h-5" />
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          text: "text-blue-700",
          icon: <Bell className="w-5 h-5" />
        };
    }
  };
  const styles = getTypeStyles();
  return <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-10 h-10 ${styles.bg} rounded-lg flex items-center justify-center ${styles.text}`}>
            {styles.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-slate-900">{announcement.title}</h3>
              {announcement.status === "draft" && <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">
                  Draft
                </span>}
            </div>
            <p className="text-slate-600 text-sm mb-2 line-clamp-2">
              {announcement.content}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>{announcement.category}</span>
              <span>•</span>
              <span>{announcement.publishedDate}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
    onClick={() => onEdit(announcement)}
    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
  >
            <Edit className="w-4 h-4" />
          </button>
          <button
    onClick={() => onDelete(announcement.id)}
    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
  >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>;
}
function AddAnnouncementModal({
  announcement,
  onClose,
  onAdd
}) {
  const [formData, setFormData] = useState(
    announcement || {
      title: "",
      content: "",
      type: "general",
      category: "General",
      status: "draft"
    }
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: announcement?.id || "",
      publishedDate: announcement?.publishedDate || (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    });
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6">
        <h2 className="text-slate-900 mb-4">
          {announcement ? "Edit Announcement" : "Create Announcement"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Title</label>
            <input
    type="text"
    value={formData.title}
    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
    placeholder="e.g., Fall 2025 Admissions Open"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Content</label>
            <textarea
    value={formData.content}
    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
    placeholder="Write your announcement here..."
    rows={4}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Type</label>
              <select
    value={formData.type}
    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
                <option value="general">General</option>
                <option value="deadline">Deadline</option>
                <option value="merit-list">Merit List</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Category</label>
              <input
    type="text"
    value={formData.category}
    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
    placeholder="e.g., Admissions"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
    type="submit"
    onClick={() => setFormData({ ...formData, status: "published" })}
    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
              Publish Now
            </button>
            <button
    type="submit"
    onClick={() => setFormData({ ...formData, status: "draft" })}
    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
  >
              Save as Draft
            </button>
            <button
    type="button"
    onClick={onClose}
    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
  >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>;
}
export {
  UniversityAnnouncements
};
