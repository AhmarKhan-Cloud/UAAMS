import { useState } from "react";
import { Award, Search, Filter, Download, FileText, School, CheckCircle, XCircle } from "lucide-react";
const mockMeritLists = [
  {
    id: "1",
    university: "NUST",
    program: "Computer Science",
    session: "Fall 2025",
    listNumber: 1,
    publishedDate: "May 20, 2025",
    totalSeats: 100,
    entries: [
      { id: "1", rollNumber: "NUST-2025-001", studentName: "Ahmed Ali", program: "Computer Science", aggregate: 92.5, status: "selected", meritPosition: 1 },
      { id: "2", rollNumber: "NUST-2025-045", studentName: "Fatima Khan", program: "Computer Science", aggregate: 91.8, status: "selected", meritPosition: 2 },
      { id: "3", rollNumber: "NUST-2025-089", studentName: "Hassan Raza", program: "Computer Science", aggregate: 90.5, status: "selected", meritPosition: 3 },
      { id: "4", rollNumber: "NUST-2025-123", studentName: "Sara Ahmed", program: "Computer Science", aggregate: 89.2, status: "waiting", meritPosition: 101 }
    ]
  },
  {
    id: "2",
    university: "FAST",
    program: "Software Engineering",
    session: "Fall 2025",
    listNumber: 1,
    publishedDate: "May 18, 2025",
    totalSeats: 80,
    entries: [
      { id: "5", rollNumber: "FAST-2025-034", studentName: "Ali Hassan", program: "Software Engineering", aggregate: 88.5, status: "selected", meritPosition: 1 },
      { id: "6", rollNumber: "FAST-2025-067", studentName: "Ayesha Khan", program: "Software Engineering", aggregate: 87.3, status: "selected", meritPosition: 2 }
    ]
  },
  {
    id: "3",
    university: "LUMS",
    program: "Business Administration",
    session: "Fall 2025",
    listNumber: 2,
    publishedDate: "May 22, 2025",
    totalSeats: 120,
    entries: [
      { id: "7", rollNumber: "LUMS-2025-112", studentName: "Zain Malik", program: "Business Administration", aggregate: 85.8, status: "selected", meritPosition: 15 },
      { id: "8", rollNumber: "LUMS-2025-234", studentName: "Hira Ahmed", program: "Business Administration", aggregate: 84.5, status: "selected", meritPosition: 25 }
    ]
  },
  {
    id: "4",
    university: "UET Lahore",
    program: "Electrical Engineering",
    session: "Fall 2025",
    listNumber: 1,
    publishedDate: "May 15, 2025",
    totalSeats: 90,
    entries: [
      { id: "9", rollNumber: "UET-2025-078", studentName: "Usman Ali", program: "Electrical Engineering", aggregate: 86.2, status: "selected", meritPosition: 12 },
      { id: "10", rollNumber: "UET-2025-156", studentName: "Maryam Siddique", program: "Electrical Engineering", aggregate: 83.9, status: "waiting", meritPosition: 95 }
    ]
  }
];
function MeritLists() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedList, setSelectedList] = useState(null);
  const universities = ["all", ...Array.from(new Set(mockMeritLists.map((m) => m.university)))];
  const filteredMeritLists = mockMeritLists.filter((list) => {
    const matchesUniversity = selectedUniversity === "all" || list.university === selectedUniversity;
    const matchesSearch = list.university.toLowerCase().includes(searchTerm.toLowerCase()) || list.program.toLowerCase().includes(searchTerm.toLowerCase()) || list.session.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesUniversity && matchesSearch;
  });
  return <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">Merit Lists</h1>
        <p className="text-slate-600">View published merit lists from universities</p>
      </div>

      {
    /* Filters */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">
              <Filter className="w-4 h-4 inline mr-2" />
              Filter by University
            </label>
            <select
    value={selectedUniversity}
    onChange={(e) => setSelectedUniversity(e.target.value)}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
  >
              <option value="all">All Universities</option>
              {universities.filter((u) => u !== "all").map((uni) => <option key={uni} value={uni}>{uni}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">
              <Search className="w-4 h-4 inline mr-2" />
              Search
            </label>
            <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search by university or program..."
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
    icon={<FileText className="w-5 h-5 text-blue-600" />}
    label="Total Lists"
    count={mockMeritLists.length}
    color="bg-blue-50"
  />
        <StatCard
    icon={<School className="w-5 h-5 text-purple-600" />}
    label="Universities"
    count={universities.length - 1}
    color="bg-purple-50"
  />
        <StatCard
    icon={<Award className="w-5 h-5 text-emerald-600" />}
    label="Programs"
    count={Array.from(new Set(mockMeritLists.map((m) => m.program))).length}
    color="bg-emerald-50"
  />
        <StatCard
    icon={<CheckCircle className="w-5 h-5 text-amber-600" />}
    label="Total Seats"
    count={mockMeritLists.reduce((acc, m) => acc + m.totalSeats, 0)}
    color="bg-amber-50"
  />
      </div>

      {
    /* Merit Lists Grid */
  }
      <div className="grid md:grid-cols-2 gap-6">
        {filteredMeritLists.length === 0 ? <div className="col-span-2 bg-white rounded-lg border border-slate-200 p-12 text-center">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-slate-900 mb-2">No Merit Lists Found</h3>
            <p className="text-slate-600 text-sm">
              Try adjusting your filters or search terms.
            </p>
          </div> : filteredMeritLists.map((list) => <MeritListCard
    key={list.id}
    meritList={list}
    onView={() => setSelectedList(list)}
  />)}
      </div>

      {
    /* Merit List Detail Modal */
  }
      {selectedList && <MeritListDetailModal
    meritList={selectedList}
    onClose={() => setSelectedList(null)}
  />}
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
function MeritListCard({
  meritList,
  onView
}) {
  return <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
            <Award className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <School className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600">{meritList.university}</span>
            </div>
            <h3 className="text-slate-900 mb-1">{meritList.program}</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>{meritList.session}</span>
              <span>•</span>
              <span>Merit List {meritList.listNumber}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
        <div>
          <div className="text-slate-600 text-sm">Total Seats</div>
          <div className="text-slate-900">{meritList.totalSeats}</div>
        </div>
        <div>
          <div className="text-slate-600 text-sm">Published</div>
          <div className="text-slate-900 text-sm">{meritList.publishedDate}</div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
    onClick={onView}
    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
  >
          View Details
        </button>
        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>;
}
function MeritListDetailModal({
  meritList,
  onClose
}) {
  const [searchRollNumber, setSearchRollNumber] = useState("");
  const filteredEntries = meritList.entries.filter(
    (entry) => entry.rollNumber.toLowerCase().includes(searchRollNumber.toLowerCase()) || entry.studentName.toLowerCase().includes(searchRollNumber.toLowerCase())
  );
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <School className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-600">{meritList.university}</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                  Merit List {meritList.listNumber}
                </span>
              </div>
              <h2 className="text-slate-900 mb-1">{meritList.program}</h2>
              <p className="text-slate-600 text-sm">
                {meritList.session} • Published {meritList.publishedDate}
              </p>
            </div>
            <button
    onClick={onClose}
    className="text-slate-400 hover:text-slate-600"
  >
              ✕
            </button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <input
    type="text"
    value={searchRollNumber}
    onChange={(e) => setSearchRollNumber(e.target.value)}
    placeholder="Search by roll number or name..."
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
  />
            </div>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {filteredEntries.map((entry) => <div
    key={entry.id}
    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
  >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                    <span className="text-slate-700">#{entry.meritPosition}</span>
                  </div>
                  <div>
                    <div className="text-slate-900">{entry.studentName}</div>
                    <div className="text-slate-600 text-sm">{entry.rollNumber}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-slate-900">{entry.aggregate}%</div>
                    <div className="text-slate-600 text-sm">Aggregate</div>
                  </div>
                  <div>
                    {entry.status === "selected" ? <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Selected
                      </span> : entry.status === "waiting" ? <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                        Waiting List
                      </span> : <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1">
                        <XCircle className="w-4 h-4" />
                        Not Selected
                      </span>}
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}
export {
  MeritLists
};
