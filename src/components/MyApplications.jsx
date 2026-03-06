import { useState } from "react";
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Download } from "lucide-react";
const mockApplications = [
  {
    id: "1",
    university: "NUST",
    program: "Computer Science",
    appliedDate: "May 15, 2025",
    status: "under-review",
    lastUpdate: "May 20, 2025",
    applicationId: "NUST-2025-12345"
  },
  {
    id: "2",
    university: "FAST",
    program: "Software Engineering",
    appliedDate: "May 10, 2025",
    status: "accepted",
    lastUpdate: "May 25, 2025",
    applicationId: "FAST-2025-67890"
  },
  {
    id: "3",
    university: "LUMS",
    program: "Computer Science",
    appliedDate: "May 5, 2025",
    status: "pending",
    lastUpdate: "May 5, 2025",
    applicationId: "LUMS-2025-54321"
  }
];
function MyApplications() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const filteredApplications = mockApplications.filter((app) => {
    if (selectedStatus === "all") return true;
    return app.status === selectedStatus;
  });
  const statusCounts = {
    all: mockApplications.length,
    pending: mockApplications.filter((a) => a.status === "pending").length,
    "under-review": mockApplications.filter((a) => a.status === "under-review").length,
    accepted: mockApplications.filter((a) => a.status === "accepted").length,
    rejected: mockApplications.filter((a) => a.status === "rejected").length
  };
  return <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">My Applications</h1>
        <p className="text-slate-600">Track the status of your university applications</p>
      </div>

      {
    /* Status Filter */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-wrap gap-2">
          <FilterButton
    label="All"
    count={statusCounts.all}
    active={selectedStatus === "all"}
    onClick={() => setSelectedStatus("all")}
  />
          <FilterButton
    label="Pending"
    count={statusCounts.pending}
    active={selectedStatus === "pending"}
    onClick={() => setSelectedStatus("pending")}
  />
          <FilterButton
    label="Under Review"
    count={statusCounts["under-review"]}
    active={selectedStatus === "under-review"}
    onClick={() => setSelectedStatus("under-review")}
  />
          <FilterButton
    label="Accepted"
    count={statusCounts.accepted}
    active={selectedStatus === "accepted"}
    onClick={() => setSelectedStatus("accepted")}
  />
          <FilterButton
    label="Rejected"
    count={statusCounts.rejected}
    active={selectedStatus === "rejected"}
    onClick={() => setSelectedStatus("rejected")}
  />
        </div>
      </div>

      {
    /* Applications List */
  }
      {filteredApplications.length === 0 ? <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">No Applications Found</h3>
          <p className="text-slate-600 text-sm">
            {selectedStatus === "all" ? "You haven't submitted any applications yet. Browse universities to get started." : `No ${selectedStatus} applications found.`}
          </p>
        </div> : <div className="space-y-4">
          {filteredApplications.map((application) => <ApplicationCard key={application.id} application={application} />)}
        </div>}
    </div>;
}
function FilterButton({
  label,
  count,
  active,
  onClick
}) {
  return <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition-colors ${active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
  >
      {label} ({count})
    </button>;
}
function ApplicationCard({ application }) {
  const getStatusIcon = () => {
    switch (application.status) {
      case "pending":
        return <Clock className="w-5 h-5 text-amber-500" />;
      case "under-review":
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };
  const getStatusColor = () => {
    switch (application.status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "under-review":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "accepted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
    }
  };
  const getStatusText = () => {
    return application.status.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };
  return <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-slate-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-slate-900 mb-1">{application.university}</h3>
            <p className="text-slate-600 mb-2">{application.program}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>Applied: {application.appliedDate}</span>
              <span>•</span>
              <span>ID: {application.applicationId}</span>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm">{getStatusText()}</span>
        </div>
      </div>

      {
    /* Timeline/Progress */
  }
      <div className="border-t border-slate-200 pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-600">Application Progress</span>
          <span className="text-sm text-slate-500">Last updated: {application.lastUpdate}</span>
        </div>
        
        <div className="relative">
          <div className="flex justify-between items-center">
            <TimelineStep
    label="Submitted"
    completed={true}
  />
            <TimelineStep
    label="Under Review"
    completed={application.status !== "pending"}
  />
            <TimelineStep
    label="Decision"
    completed={application.status === "accepted" || application.status === "rejected"}
  />
          </div>
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-10">
            <div
    className="h-full bg-emerald-500 transition-all"
    style={{
      width: application.status === "pending" ? "33%" : application.status === "under-review" ? "66%" : "100%"
    }}
  />
          </div>
        </div>
      </div>

      {
    /* Actions */
  }
      <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
        <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Application
        </button>
        {application.status === "accepted" && <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Download Admission Letter
          </button>}
        <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
          View Details
        </button>
      </div>
    </div>;
}
function TimelineStep({ label, completed }) {
  return <div className="flex flex-col items-center relative z-10">
      <div
    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${completed ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"}`}
  >
        {completed && <CheckCircle className="w-5 h-5" />}
      </div>
      <span className={`text-xs mt-2 ${completed ? "text-slate-700" : "text-slate-500"}`}>
        {label}
      </span>
    </div>;
}
export {
  MyApplications
};
