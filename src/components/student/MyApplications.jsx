import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
} from "lucide-react";
import { api } from "../../lib/apiClient";
import { downloadPdfDocument, downloadPdfFromUrl } from "../../lib/pdfDownload";
import { onDataUpdated } from "../../lib/socketClient";

const statusOptions = [
  { key: "all", label: "All" },
  { key: "not-submitted", label: "Not Submitted" },
  { key: "pending", label: "Pending" },
  { key: "under-review", label: "Under Review" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
  { key: "assigned", label: "Assigned" },
];

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const normalizeApplication = (item) => ({
  id: String(item?._id || item?.id || ""),
  applicationCode: item?.applicationCode || "N/A",
  universityId: String(item?.university?._id || item?.university?.id || item?.university || ""),
  university: item?.university?.name || "University",
  program: item?.program || "Program",
  appliedDate: formatDate(item?.appliedAt || item?.createdAt),
  lastUpdate: formatDate(item?.updatedAt || item?.createdAt),
  status: item?.status || "not-submitted",
  paymentStatus: item?.payment?.status || "unpaid",
  rollNumberSlip: item?.rollNumber?.slipFileUrl || "",
  rollNumberSlipName: item?.rollNumber?.slipFileName || "",
  admissionLetter: item?.admissionLetter?.fileUrl || "",
  admissionLetterName: item?.admissionLetter?.fileName || "",
});

export function MyApplications() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadApplications = async ({ silent = false } = {}) => {
      if (!silent) {
        setIsLoading(true);
      }
      setError("");
      try {
        const response = await api.get("/applications/me");
        const items = response?.data?.applications || [];
        if (!isMounted) return;
        setApplications(items.map(normalizeApplication));
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError?.message || "Unable to load applications right now.");
      } finally {
        if (isMounted && !silent) {
          setIsLoading(false);
        }
      }
    };

    loadApplications();
    const unsubscribe = onDataUpdated((event) => {
      if (event?.resource === "applications" || event?.resource === "merit-lists") {
        loadApplications({ silent: true });
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const filteredApplications = useMemo(
    () =>
      applications.filter((app) => {
        if (selectedStatus === "all") return true;
        return app.status === selectedStatus;
      }),
    [applications, selectedStatus],
  );

  const statusCounts = useMemo(() => {
    const counts = {
      all: applications.length,
      "not-submitted": 0,
      pending: 0,
      "under-review": 0,
      accepted: 0,
      rejected: 0,
      assigned: 0,
    };

    applications.forEach((application) => {
      if (counts[application.status] !== undefined) {
        counts[application.status] += 1;
      }
    });

    return counts;
  }, [applications]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">My Applications</h1>
        <p className="text-slate-600">Track the status of your university applications</p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <FilterButton
              key={option.key}
              label={option.label}
              count={statusCounts[option.key] || 0}
              active={selectedStatus === option.key}
              onClick={() => setSelectedStatus(option.key)}
            />
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-600 text-sm">
          Loading your applications...
        </div>
      ) : null}

      {!isLoading && error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      {!isLoading && !error && filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">No Applications Found</h3>
          <p className="text-slate-600 text-sm">
            {selectedStatus === "all"
              ? "You have not submitted any applications yet. Browse recommendations to get started."
              : `No ${selectedStatus.replace("-", " ")} applications found.`}
          </p>
        </div>
      ) : null}

      {!isLoading && !error && filteredApplications.length > 0 ? (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function FilterButton({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors ${
        active
          ? "bg-emerald-600 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
      }`}
    >
      {label} ({count})
    </button>
  );
}

function ApplicationCard({ application }) {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

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
      case "assigned":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-500" />;
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
      case "assigned":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const statusText = application.status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const progressWidth =
    application.status === "not-submitted"
      ? "20%"
      : application.status === "pending"
      ? "40%"
      : application.status === "under-review"
      ? "60%"
      : application.status === "accepted" || application.status === "rejected"
      ? "80%"
      : application.status === "assigned"
      ? "100%"
      : "0%";
  const isUnpaidDraft =
    application.status === "not-submitted" &&
    application.paymentStatus !== "paid" &&
    Boolean(application.universityId);

  const downloadApplicationPdf = () => {
    downloadPdfDocument({
      title: "UAAMS Application Summary",
      fileName: `${application.applicationCode || "application"}-summary.pdf`,
      lines: [
        `Application Code: ${application.applicationCode}`,
        `University: ${application.university}`,
        `Program: ${application.program}`,
        `Applied Date: ${application.appliedDate}`,
        `Last Updated: ${application.lastUpdate}`,
        `Status: ${statusText}`,
        `Payment Status: ${application.paymentStatus}`,
      ],
    });
  };

  const downloadLinkedOrFallbackPdf = async ({ url, fileName, fallbackTitle, fallbackLines }) => {
    setIsDownloading(true);
    try {
      if (url) {
        await downloadPdfFromUrl(url, fileName);
        return;
      }
      throw new Error("No URL available");
    } catch {
      downloadPdfDocument({
        title: fallbackTitle,
        fileName,
        lines: fallbackLines,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
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
              <span>|</span>
              <span>ID: {application.applicationCode}</span>
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm">{statusText}</span>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-slate-600">Application Progress</span>
          <span className="text-sm text-slate-500">Last updated: {application.lastUpdate}</span>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center">
            <TimelineStep label="Payment" completed={application.paymentStatus === "paid"} />
            <TimelineStep label="Submitted" completed={application.status !== "not-submitted"} />
            <TimelineStep
              label="Under Review"
              completed={["under-review", "accepted", "rejected", "assigned"].includes(application.status)}
            />
            <TimelineStep
              label="Decision"
              completed={["accepted", "rejected", "assigned"].includes(application.status)}
            />
            <TimelineStep label="Finalized" completed={application.status === "assigned"} />
          </div>
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-10">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: progressWidth }} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
        {isUnpaidDraft ? (
          <button
            type="button"
            onClick={() =>
              navigate(`/student/apply/${application.universityId}/payment/${application.id}`)
            }
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Resume Unpaid Draft
          </button>
        ) : null}
        <button
          type="button"
          onClick={downloadApplicationPdf}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Application
        </button>
        {["accepted", "assigned"].includes(application.status) && application.rollNumberSlip ? (
          <button
            type="button"
            onClick={() =>
              downloadLinkedOrFallbackPdf({
                url: application.rollNumberSlip,
                fileName:
                  application.rollNumberSlipName ||
                  `${application.applicationCode || "application"}-roll-number-slip.pdf`,
                fallbackTitle: "Roll Number Slip",
                fallbackLines: [
                  `Application Code: ${application.applicationCode}`,
                  `University: ${application.university}`,
                  `Program: ${application.program}`,
                  "Slip URL was unavailable. This summary is generated from current record.",
                ],
              })
            }
            disabled={isDownloading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Download Roll Number Slip
          </button>
        ) : null}
        {application.admissionLetter ? (
          <button
            type="button"
            onClick={() =>
              downloadLinkedOrFallbackPdf({
                url: application.admissionLetter,
                fileName:
                  application.admissionLetterName ||
                  `${application.applicationCode || "application"}-admission-letter.pdf`,
                fallbackTitle: "Admission Letter",
                fallbackLines: [
                  `Application Code: ${application.applicationCode}`,
                  `University: ${application.university}`,
                  `Program: ${application.program}`,
                  "Admission letter URL was unavailable. This summary is generated from current record.",
                ],
              })
            }
            disabled={isDownloading}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Download Admission Letter
          </button>
        ) : null}
      </div>
    </div>
  );
}

function TimelineStep({ label, completed }) {
  return (
    <div className="flex flex-col items-center relative z-10">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
          completed
            ? "bg-emerald-500 text-white"
            : "bg-slate-200 text-slate-400"
        }`}
      >
        {completed ? <CheckCircle className="w-5 h-5" /> : null}
      </div>
      <span className={`text-xs mt-2 ${completed ? "text-slate-700" : "text-slate-500"}`}>{label}</span>
    </div>
  );
}
