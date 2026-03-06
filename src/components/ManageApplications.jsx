import { useState } from "react";
import { Search, Download, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
const mockApplications = [
  {
    id: "APP-001",
    studentName: "Ahmed Hassan",
    email: "ahmed.hassan@email.com",
    program: "Computer Science",
    aggregate: 85.5,
    matricMarks: 920,
    interMarks: 980,
    testScore: 88,
    appliedDate: "2025-05-15",
    status: "pending",
    cnic: "12345-1234567-1"
  },
  {
    id: "APP-002",
    studentName: "Fatima Khan",
    email: "fatima.khan@email.com",
    program: "Electrical Engineering",
    aggregate: 82.3,
    matricMarks: 900,
    interMarks: 950,
    testScore: 85,
    appliedDate: "2025-05-14",
    status: "under-review",
    cnic: "12345-1234567-2"
  },
  {
    id: "APP-003",
    studentName: "Ali Raza",
    email: "ali.raza@email.com",
    program: "Software Engineering",
    aggregate: 88.2,
    matricMarks: 950,
    interMarks: 1e3,
    testScore: 92,
    appliedDate: "2025-05-13",
    status: "accepted",
    cnic: "12345-1234567-3"
  },
  {
    id: "APP-004",
    studentName: "Sara Ahmed",
    email: "sara.ahmed@email.com",
    program: "Business Administration",
    aggregate: 79.5,
    matricMarks: 880,
    interMarks: 920,
    testScore: 80,
    appliedDate: "2025-05-12",
    status: "rejected",
    cnic: "12345-1234567-4"
  },
  {
    id: "APP-005",
    studentName: "Usman Malik",
    email: "usman.malik@email.com",
    program: "Computer Science",
    aggregate: 86.7,
    matricMarks: 930,
    interMarks: 990,
    testScore: 90,
    appliedDate: "2025-05-11",
    status: "accepted",
    cnic: "12345-1234567-5"
  }
];
function ManageApplications({ universityId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applications, setApplications] = useState(() => {
    const stored = localStorage.getItem(`applications_${universityId}`);
    return stored ? JSON.parse(stored) : mockApplications;
  });
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || app.email.toLowerCase().includes(searchTerm.toLowerCase()) || app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
    const matchesProgram = selectedProgram === "all" || app.program === selectedProgram;
    return matchesSearch && matchesStatus && matchesProgram;
  });
  const programs = Array.from(new Set(applications.map((app) => app.program)));
  return <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">Manage Applications</h1>
        <p className="text-slate-600">Review and process student applications</p>
      </div>

      {
    /* Filters */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-slate-700 mb-2 text-sm">Search Applications</label>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search by name, email, or ID..."
    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Status</label>
            <select
    value={selectedStatus}
    onChange={(e) => setSelectedStatus(e.target.value)}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Program</label>
            <select
    value={selectedProgram}
    onChange={(e) => setSelectedProgram(e.target.value)}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
              <option value="all">All Programs</option>
              {programs.map((program) => <option key={program} value={program}>{program}</option>)}
            </select>
          </div>
        </div>
      </div>

      {
    /* Stats */
  }
      <div className="grid md:grid-cols-4 gap-4">
        <StatCard label="Total" count={applications.length} color="bg-blue-50 text-blue-600" />
        <StatCard
    label="Pending"
    count={applications.filter((a) => a.status === "pending").length}
    color="bg-amber-50 text-amber-600"
  />
        <StatCard
    label="Accepted"
    count={applications.filter((a) => a.status === "accepted").length}
    color="bg-emerald-50 text-emerald-600"
  />
        <StatCard
    label="Rejected"
    count={applications.filter((a) => a.status === "rejected").length}
    color="bg-red-50 text-red-600"
  />
      </div>

      {
    /* Applications Table */
  }
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-slate-700 text-sm">Application ID</th>
                <th className="px-6 py-3 text-left text-slate-700 text-sm">Student Name</th>
                <th className="px-6 py-3 text-left text-slate-700 text-sm">Program</th>
                <th className="px-6 py-3 text-left text-slate-700 text-sm">Aggregate</th>
                <th className="px-6 py-3 text-left text-slate-700 text-sm">Applied Date</th>
                <th className="px-6 py-3 text-left text-slate-700 text-sm">Status</th>
                <th className="px-6 py-3 text-left text-slate-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApplications.map((application) => <tr key={application.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{application.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-900">{application.studentName}</div>
                    <div className="text-xs text-slate-500">{application.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{application.program}</td>
                  <td className="px-6 py-4">
                    <span className="text-emerald-600">{application.aggregate}%</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{application.appliedDate}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={application.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
    onClick={() => setSelectedApplication(application)}
    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
    title="View Details"
  >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
    title="Download"
  >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {
    /* Application Detail Modal */
  }
      {selectedApplication && <ApplicationDetailModal
    application={selectedApplication}
    onClose={() => setSelectedApplication(null)}
  />}
    </div>;
}
function StatCard({ label, count, color }) {
  return <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="text-slate-600 text-sm mb-1">{label}</div>
      <div className={`text-3xl ${color}`}>{count}</div>
    </div>;
}
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    "under-review": "bg-blue-100 text-blue-700 border-blue-200",
    accepted: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200"
  };
  const icons = {
    pending: <Clock className="w-4 h-4" />,
    "under-review": <Clock className="w-4 h-4" />,
    accepted: <CheckCircle className="w-4 h-4" />,
    rejected: <XCircle className="w-4 h-4" />
  };
  return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${styles[status]}`}>
      {icons[status]}
      {status.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
    </span>;
}
function ApplicationDetailModal({
  application,
  onClose
}) {
  const [status, setStatus] = useState(application.status);
  const handleStatusChange = () => {
    alert(`Application status updated to: ${status}`);
    onClose();
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-slate-900 mb-1">Application Details</h2>
              <p className="text-slate-600">{application.id}</p>
            </div>
            <button
    onClick={onClose}
    className="text-slate-400 hover:text-slate-600"
  >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {
    /* Student Information */
  }
          <div>
            <h3 className="text-slate-900 mb-3">Student Information</h3>
            <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
              <DetailItem label="Full Name" value={application.studentName} />
              <DetailItem label="Email" value={application.email} />
              <DetailItem label="CNIC" value={application.cnic} />
              <DetailItem label="Applied Date" value={application.appliedDate} />
            </div>
          </div>

          {
    /* Academic Information */
  }
          <div>
            <h3 className="text-slate-900 mb-3">Academic Information</h3>
            <div className="grid md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
              <DetailItem label="Program" value={application.program} />
              <DetailItem label="Aggregate" value={`${application.aggregate}%`} />
              <DetailItem label="Matric Marks" value={`${application.matricMarks}/1100`} />
              <DetailItem label="Inter Marks" value={`${application.interMarks}/1100`} />
              <DetailItem label="Test Score" value={`${application.testScore}/100`} />
            </div>
          </div>

          {
    /* Status Management */
  }
          <div>
            <h3 className="text-slate-900 mb-3">Application Status</h3>
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="mb-4">
                <label className="block text-slate-700 mb-2 text-sm">Update Status</label>
                <select
    value={status}
    onChange={(e) => setStatus(e.target.value)}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
    onClick={handleStatusChange}
    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
                  Update Status
                </button>
                <button
    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
  >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
}
function DetailItem({ label, value }) {
  return <div>
      <div className="text-slate-600 text-sm mb-1">{label}</div>
      <div className="text-slate-900">{value}</div>
    </div>;
}
export {
  ManageApplications
};
