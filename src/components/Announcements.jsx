import { useState } from "react";
import { Bell, Calendar, School, AlertCircle, TrendingUp } from "lucide-react";
const mockAnnouncements = [
  {
    id: "1",
    university: "NUST",
    title: "Fall 2025 Admissions Open",
    content: "Applications for Fall 2025 session are now open for all undergraduate programs. NET-I test will be conducted on June 15, 2025. Last date to apply is June 10, 2025.",
    date: "2 days ago",
    type: "deadline",
    category: "Admissions"
  },
  {
    id: "2",
    university: "FAST",
    title: "First Merit List Published",
    content: "The first merit list for Computer Science and Software Engineering programs has been published. Successful candidates must confirm admission by May 30, 2025.",
    date: "5 days ago",
    type: "merit-list",
    category: "Merit Lists"
  },
  {
    id: "3",
    university: "LUMS",
    title: "Application Deadline Extended",
    content: "Due to popular demand, the application deadline for undergraduate programs has been extended to July 20, 2025. Students can still apply through the UAAMS portal.",
    date: "1 week ago",
    type: "urgent",
    category: "Deadlines"
  },
  {
    id: "4",
    university: "UET Lahore",
    title: "ECAT Test Schedule Announced",
    content: "The Engineering College Admission Test (ECAT) will be conducted on June 20, 2025. Roll number slips will be available for download from June 15.",
    date: "1 week ago",
    type: "general",
    category: "Tests"
  },
  {
    id: "5",
    university: "COMSATS",
    title: "New Scholarship Program Launched",
    content: "COMSATS University announces merit-based scholarships covering up to 100% tuition fee for deserving students. Apply before June 5, 2025.",
    date: "2 weeks ago",
    type: "general",
    category: "Scholarships"
  },
  {
    id: "6",
    university: "Air University",
    title: "Second Merit List Update",
    content: "Second merit list for Aerospace Engineering and Computer Science programs will be announced on June 1, 2025. Check your application status regularly.",
    date: "2 weeks ago",
    type: "merit-list",
    category: "Merit Lists"
  },
  {
    id: "7",
    university: "NUST",
    title: "Fee Structure for 2025 Released",
    content: "Updated fee structure for all undergraduate programs is now available. Financial assistance options are also available for eligible students.",
    date: "3 weeks ago",
    type: "general",
    category: "Fee Information"
  },
  {
    id: "8",
    university: "FAST",
    title: "Important: Document Verification Schedule",
    content: "Selected candidates must complete document verification between June 10-15, 2025. Bring original documents along with attested copies.",
    date: "3 weeks ago",
    type: "urgent",
    category: "Verification"
  }
];
function Announcements() {
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const filteredAnnouncements = mockAnnouncements.filter((announcement) => {
    const matchesType = selectedType === "all" || announcement.type === selectedType;
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) || announcement.university.toLowerCase().includes(searchTerm.toLowerCase()) || announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });
  return <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">Announcements & Updates</h1>
        <p className="text-slate-600">Stay updated with the latest university announcements</p>
      </div>

      {
    /* Filters and Search */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Filter by Type</label>
            <select
    value={selectedType}
    onChange={(e) => setSelectedType(e.target.value)}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
  >
              <option value="all">All Announcements</option>
              <option value="deadline">Deadlines</option>
              <option value="merit-list">Merit Lists</option>
              <option value="urgent">Urgent</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Search</label>
            <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search announcements..."
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
  />
          </div>
        </div>
      </div>

      {
    /* Stats */
  }
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard
    icon={<Bell className="w-5 h-5 text-blue-600" />}
    label="Total"
    count={mockAnnouncements.length}
    color="bg-blue-50"
  />
        <StatCard
    icon={<Calendar className="w-5 h-5 text-amber-600" />}
    label="Deadlines"
    count={mockAnnouncements.filter((a) => a.type === "deadline").length}
    color="bg-amber-50"
  />
        <StatCard
    icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
    label="Merit Lists"
    count={mockAnnouncements.filter((a) => a.type === "merit-list").length}
    color="bg-emerald-50"
  />
        <StatCard
    icon={<AlertCircle className="w-5 h-5 text-red-600" />}
    label="Urgent"
    count={mockAnnouncements.filter((a) => a.type === "urgent").length}
    color="bg-red-50"
  />
      </div>

      {
    /* Announcements List */
  }
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Bell className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-slate-900 mb-2">No Announcements Found</h3>
            <p className="text-slate-600 text-sm">
              Try adjusting your filters or search terms.
            </p>
          </div> : filteredAnnouncements.map((announcement) => <AnnouncementCard key={announcement.id} announcement={announcement} />)}
      </div>
    </div>;
}
function StatCard({
  icon,
  label,
  count,
  color
}) {
  return <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-slate-600 text-sm">{label}</div>
      <div className="text-slate-900 text-2xl">{count}</div>
    </div>;
}
function AnnouncementCard({ announcement }) {
  const [expanded, setExpanded] = useState(false);
  const getTypeStyles = () => {
    switch (announcement.type) {
      case "deadline":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          icon: <Calendar className="w-5 h-5" />
        };
      case "merit-list":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700",
          icon: <TrendingUp className="w-5 h-5" />
        };
      case "urgent":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: <AlertCircle className="w-5 h-5" />
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
  return <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className={`w-10 h-10 ${styles.bg} rounded-lg flex items-center justify-center ${styles.text}`}>
              {styles.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <School className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">{announcement.university}</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                  {announcement.category}
                </span>
              </div>
              <h3 className="text-slate-900 mb-2">{announcement.title}</h3>
              <p className={`text-slate-600 text-sm ${!expanded && "line-clamp-2"}`}>
                {announcement.content}
              </p>
            </div>
          </div>
          <span className="text-slate-500 text-sm whitespace-nowrap ml-4">
            {announcement.date}
          </span>
        </div>

        <button
    onClick={() => setExpanded(!expanded)}
    className="text-emerald-600 hover:text-emerald-700 text-sm mt-2"
  >
          {expanded ? "Show Less" : "Read More"} →
        </button>
      </div>
    </div>;
}
export {
  Announcements
};
