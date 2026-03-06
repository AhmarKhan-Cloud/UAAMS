import { useState } from "react";
import { Upload, Download, Search, CheckCircle, FileText, User, Hash, Eye, X, Award, Send } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
function AdmissionLetterManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [uploadingFor, setUploadingFor] = useState(null);
  const [viewingLetter, setViewingLetter] = useState(null);
  const [applications, setApplications] = useState([
    {
      id: "APP-001",
      studentName: "Ahmed Ali Khan",
      studentEmail: "ahmed.ali@email.com",
      program: "BS Computer Science",
      department: "Computer Science",
      applicationDate: "2024-12-15",
      merit: 92.5,
      rollNumber: "BSCS-2025-001",
      meritPosition: 1,
      admissionLetter: {
        fileName: "admission_letter_ahmed_ali.pdf",
        uploadDate: "2025-01-04",
        uploadedBy: "Dr. Sarah Khan",
        fileUrl: "#",
        letterNumber: "ADM/CS/2025/001",
        sentToStudent: true
      }
    },
    {
      id: "APP-002",
      studentName: "Fatima Noor",
      studentEmail: "fatima.noor@email.com",
      program: "BS Software Engineering",
      department: "Computer Science",
      applicationDate: "2024-12-18",
      merit: 91.8,
      rollNumber: "BSSE-2025-001",
      meritPosition: 2
    },
    {
      id: "APP-003",
      studentName: "Muhammad Hassan",
      studentEmail: "hassan.m@email.com",
      program: "BS Electrical Engineering",
      department: "Electrical Engineering",
      applicationDate: "2024-12-20",
      merit: 90.2,
      rollNumber: "BSEE-2025-001",
      meritPosition: 3
    },
    {
      id: "APP-004",
      studentName: "Ayesha Malik",
      studentEmail: "ayesha.malik@email.com",
      program: "BS Mechanical Engineering",
      department: "Mechanical Engineering",
      applicationDate: "2024-12-22",
      merit: 89.5,
      rollNumber: "BSME-2025-001",
      meritPosition: 5
    },
    {
      id: "APP-005",
      studentName: "Usman Tariq",
      studentEmail: "usman.tariq@email.com",
      program: "BS Civil Engineering",
      department: "Civil Engineering",
      applicationDate: "2024-12-25",
      merit: 88.9,
      rollNumber: "BSCE-2025-001",
      meritPosition: 8
    },
    {
      id: "APP-006",
      studentName: "Zainab Ahmed",
      studentEmail: "zainab.a@email.com",
      program: "BS Artificial Intelligence",
      department: "Computer Science",
      applicationDate: "2024-12-28",
      merit: 93.1,
      rollNumber: "BSAI-2025-001",
      meritPosition: 1,
      admissionLetter: {
        fileName: "admission_letter_zainab_ahmed.pdf",
        uploadDate: "2025-01-05",
        uploadedBy: "Dr. Sarah Khan",
        fileUrl: "#",
        letterNumber: "ADM/AI/2025/001",
        sentToStudent: false
      }
    },
    {
      id: "APP-007",
      studentName: "Ibrahim Raza",
      studentEmail: "ibrahim.raza@email.com",
      program: "BS Data Science",
      department: "Computer Science",
      applicationDate: "2024-12-30",
      merit: 91.2,
      rollNumber: "BSDS-2025-001",
      meritPosition: 4
    },
    {
      id: "APP-008",
      studentName: "Maryam Khan",
      studentEmail: "maryam.khan@email.com",
      program: "BS Electronics Engineering",
      department: "Electrical Engineering",
      applicationDate: "2025-01-01",
      merit: 90.7,
      rollNumber: "BSElec-2025-001",
      meritPosition: 6
    }
  ]);
  const [uploadForm, setUploadForm] = useState({
    letterNumber: "",
    fileName: "",
    file: null,
    remarks: ""
  });
  const departments = ["all", "Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"];
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || app.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) || app.program.toLowerCase().includes(searchQuery.toLowerCase()) || app.id.toLowerCase().includes(searchQuery.toLowerCase()) || app.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = filterDepartment === "all" || app.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm({
        ...uploadForm,
        file,
        fileName: file.name
      });
    }
  };
  const handleUploadLetter = () => {
    if (!uploadingFor || !uploadForm.letterNumber || !uploadForm.file) {
      alert("Please fill in all required fields");
      return;
    }
    const updatedApplications = applications.map((app) => {
      if (app.id === uploadingFor) {
        return {
          ...app,
          admissionLetter: {
            fileName: uploadForm.fileName,
            uploadDate: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            uploadedBy: "Current User",
            fileUrl: URL.createObjectURL(uploadForm.file),
            letterNumber: uploadForm.letterNumber,
            sentToStudent: false
          }
        };
      }
      return app;
    });
    setApplications(updatedApplications);
    setUploadingFor(null);
    setUploadForm({ letterNumber: "", fileName: "", file: null, remarks: "" });
    alert("Admission letter uploaded successfully!");
  };
  const handleDownloadLetter = (app) => {
    if (app.admissionLetter) {
      alert(`Downloading ${app.admissionLetter.fileName}`);
    }
  };
  const handleSendToStudent = (appId) => {
    if (confirm("Are you sure you want to send this admission letter to the student via email?")) {
      const updatedApplications = applications.map((app) => {
        if (app.id === appId && app.admissionLetter) {
          return {
            ...app,
            admissionLetter: {
              ...app.admissionLetter,
              sentToStudent: true
            }
          };
        }
        return app;
      });
      setApplications(updatedApplications);
      alert("Admission letter sent to student successfully!");
    }
  };
  const handleDeleteLetter = (appId) => {
    if (confirm("Are you sure you want to delete this admission letter?")) {
      const updatedApplications = applications.map((app) => {
        if (app.id === appId) {
          const { admissionLetter, ...rest } = app;
          return rest;
        }
        return app;
      });
      setApplications(updatedApplications);
    }
  };
  const stats = {
    total: applications.length,
    withLetter: applications.filter((app) => app.admissionLetter).length,
    pending: applications.filter((app) => !app.admissionLetter).length,
    sent: applications.filter((app) => app.admissionLetter?.sentToStudent).length
  };
  if (uploadingFor) {
    const application = applications.find((app) => app.id === uploadingFor);
    if (!application) return null;
    return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="bg-white max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-slate-900">Upload Admission Letter</h2>
            <button
      onClick={() => {
        setUploadingFor(null);
        setUploadForm({ letterNumber: "", fileName: "", file: null, remarks: "" });
      }}
      className="text-slate-400 hover:text-slate-600"
    >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            {
      /* Student Info */
    }
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-600">Student:</span>
                  <div className="text-slate-900">{application.studentName}</div>
                </div>
                <div>
                  <span className="text-slate-600">Email:</span>
                  <div className="text-slate-900">{application.studentEmail}</div>
                </div>
                <div>
                  <span className="text-slate-600">Roll Number:</span>
                  <div className="text-slate-900">{application.rollNumber}</div>
                </div>
                <div>
                  <span className="text-slate-600">Merit Position:</span>
                  <div className="text-slate-900">#{application.meritPosition}</div>
                </div>
                <div>
                  <span className="text-slate-600">Program:</span>
                  <div className="text-slate-900">{application.program}</div>
                </div>
                <div>
                  <span className="text-slate-600">Merit Score:</span>
                  <div className="text-slate-900">{application.merit}%</div>
                </div>
              </div>
            </div>

            {
      /* Letter Number */
    }
            <div>
              <Label htmlFor="letterNumber">Admission Letter Number *</Label>
              <Input
      id="letterNumber"
      placeholder="e.g., ADM/CS/2025/001"
      value={uploadForm.letterNumber}
      onChange={(e) => setUploadForm({ ...uploadForm, letterNumber: e.target.value })}
      className="mt-2"
    />
              <p className="text-xs text-slate-500 mt-1">Enter the official admission letter reference number</p>
            </div>

            {
      /* File Upload */
    }
            <div>
              <Label htmlFor="file">Upload Admission Letter (PDF) *</Label>
              <div className="mt-2">
                <input
      type="file"
      id="file"
      accept=".pdf"
      onChange={handleFileChange}
      className="hidden"
    />
                <label
      htmlFor="file"
      className="flex items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
    >
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">
                    {uploadForm.fileName || "Click to upload PDF file"}
                  </span>
                </label>
                {uploadForm.fileName && <div className="mt-2 text-sm text-slate-600 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {uploadForm.fileName}
                  </div>}
              </div>
            </div>

            {
      /* Remarks */
    }
            <div>
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
      id="remarks"
      placeholder="Add any additional notes or instructions..."
      value={uploadForm.remarks}
      onChange={(e) => setUploadForm({ ...uploadForm, remarks: e.target.value })}
      className="mt-2"
      rows={3}
    />
            </div>
          </div>

          {
      /* Action Buttons */
    }
          <div className="flex gap-3">
            <Button
      onClick={() => {
        setUploadingFor(null);
        setUploadForm({ letterNumber: "", fileName: "", file: null, remarks: "" });
      }}
      variant="outline"
      className="flex-1"
    >
              Cancel
            </Button>
            <Button
      onClick={handleUploadLetter}
      className="flex-1 gap-2"
      disabled={!uploadForm.letterNumber || !uploadForm.file}
    >
              <Upload className="w-4 h-4" />
              Upload Letter
            </Button>
          </div>
        </Card>
      </div>;
  }
  if (viewingLetter && viewingLetter.admissionLetter) {
    return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="bg-white max-w-2xl w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-slate-900">Admission Letter Details</h2>
            <button
      onClick={() => setViewingLetter(null)}
      className="text-slate-400 hover:text-slate-600"
    >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {
      /* Student Details */
    }
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-slate-900 mb-4">Student Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Student Name:</span>
                  <div className="text-slate-900">{viewingLetter.studentName}</div>
                </div>
                <div>
                  <span className="text-slate-600">Email:</span>
                  <div className="text-slate-900">{viewingLetter.studentEmail}</div>
                </div>
                <div>
                  <span className="text-slate-600">Program:</span>
                  <div className="text-slate-900">{viewingLetter.program}</div>
                </div>
                <div>
                  <span className="text-slate-600">Department:</span>
                  <div className="text-slate-900">{viewingLetter.department}</div>
                </div>
                <div>
                  <span className="text-slate-600">Roll Number:</span>
                  <div className="text-slate-900">{viewingLetter.rollNumber}</div>
                </div>
                <div>
                  <span className="text-slate-600">Merit Position:</span>
                  <div className="text-slate-900">#{viewingLetter.meritPosition}</div>
                </div>
              </div>
            </div>

            {
      /* Letter Details */
    }
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-slate-900 mb-4">Letter Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-600">Letter Number:</span>
                  <div className="text-slate-900">{viewingLetter.admissionLetter.letterNumber}</div>
                </div>
                <div>
                  <span className="text-slate-600">File Name:</span>
                  <div className="text-slate-900">{viewingLetter.admissionLetter.fileName}</div>
                </div>
                <div>
                  <span className="text-slate-600">Upload Date:</span>
                  <div className="text-slate-900">{viewingLetter.admissionLetter.uploadDate}</div>
                </div>
                <div>
                  <span className="text-slate-600">Uploaded By:</span>
                  <div className="text-slate-900">{viewingLetter.admissionLetter.uploadedBy}</div>
                </div>
                <div>
                  <span className="text-slate-600">Status:</span>
                  <div>
                    {viewingLetter.admissionLetter.sentToStudent ? <Badge className="bg-green-100 text-green-700 gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Sent to Student
                      </Badge> : <Badge variant="outline" className="text-amber-700 border-amber-300">
                        Not Sent
                      </Badge>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {
      /* Action Buttons */
    }
          <div className="flex gap-3 mt-6">
            <Button
      onClick={() => handleDownloadLetter(viewingLetter)}
      variant="outline"
      className="flex-1 gap-2"
    >
              <Download className="w-4 h-4" />
              Download
            </Button>
            {!viewingLetter.admissionLetter.sentToStudent && <Button
      onClick={() => {
        handleSendToStudent(viewingLetter.id);
        setViewingLetter(null);
      }}
      className="flex-1 gap-2"
    >
                <Send className="w-4 h-4" />
                Send to Student
              </Button>}
            <Button
      onClick={() => setViewingLetter(null)}
      variant="outline"
    >
              Close
            </Button>
          </div>
        </Card>
      </div>;
  }
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div>
        <h1 className="text-slate-900 mb-2">Admission Letter Management</h1>
        <p className="text-slate-600">
          Upload and manage admission letters for students who have secured their place in the merit list
        </p>
      </div>

      {
    /* Stats Cards */
  }
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-600 text-sm">Total Students</div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="text-slate-900 text-3xl">{stats.total}</div>
          <div className="text-xs text-slate-500 mt-1">With roll numbers</div>
        </Card>

        <Card className="bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-600 text-sm">Letters Uploaded</div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div className="text-slate-900 text-3xl">{stats.withLetter}</div>
          <div className="text-xs text-slate-500 mt-1">
            {(stats.withLetter / stats.total * 100).toFixed(0)}% completed
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-600 text-sm">Pending Upload</div>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="text-slate-900 text-3xl">{stats.pending}</div>
        </Card>

        <Card className="bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-600 text-sm">Sent to Students</div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="text-slate-900 text-3xl">{stats.sent}</div>
        </Card>
      </div>

      {
    /* Search and Filters */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {
    /* Search */
  }
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
    type="text"
    placeholder="Search by name, email, roll number, or program..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-10"
  />
          </div>

          {
    /* Department Filter */
  }
          <div className="w-full md:w-64">
            <select
    value={filterDepartment}
    onChange={(e) => setFilterDepartment(e.target.value)}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
              {departments.map((dept) => <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>)}
            </select>
          </div>
        </div>
      </Card>

      {
    /* Applications Table */
  }
      <Card className="bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm text-slate-600">Student Details</th>
                <th className="text-left px-6 py-4 text-sm text-slate-600">Program</th>
                <th className="text-left px-6 py-4 text-sm text-slate-600">Roll Number</th>
                <th className="text-left px-6 py-4 text-sm text-slate-600">Merit</th>
                <th className="text-left px-6 py-4 text-sm text-slate-600">Letter Number</th>
                <th className="text-left px-6 py-4 text-sm text-slate-600">Status</th>
                <th className="text-left px-6 py-4 text-sm text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredApplications.length === 0 ? <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No applications found
                  </td>
                </tr> : filteredApplications.map((app) => <tr key={app.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-slate-900 flex items-center gap-2">
                          {app.studentName}
                          {app.meritPosition <= 3 && <Award className="w-4 h-4 text-amber-500" />}
                        </div>
                        <div className="text-xs text-slate-500">{app.studentEmail}</div>
                        <div className="text-xs text-slate-500">Position: #{app.meritPosition}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-900">{app.program}</div>
                      <div className="text-xs text-slate-500">{app.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900">{app.rollNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {app.merit}%
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {app.admissionLetter ? <span className="text-slate-900 text-sm">{app.admissionLetter.letterNumber}</span> : <span className="text-slate-400 text-sm">Not assigned</span>}
                    </td>
                    <td className="px-6 py-4">
                      {app.admissionLetter ? app.admissionLetter.sentToStudent ? <Badge className="bg-green-100 text-green-700 gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Sent
                          </Badge> : <Badge className="bg-blue-100 text-blue-700 gap-1">
                            <FileText className="w-3 h-3" />
                            Uploaded
                          </Badge> : <Badge variant="outline" className="text-amber-700 border-amber-300 gap-1">
                          <Upload className="w-3 h-3" />
                          Pending
                        </Badge>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {app.admissionLetter ? <>
                            <Button
    size="sm"
    variant="outline"
    onClick={() => setViewingLetter(app)}
    className="gap-1"
  >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button
    size="sm"
    variant="outline"
    onClick={() => handleDownloadLetter(app)}
    className="gap-1"
  >
                              <Download className="w-4 h-4" />
                            </Button>
                            {!app.admissionLetter.sentToStudent && <Button
    size="sm"
    onClick={() => handleSendToStudent(app.id)}
    className="gap-1"
  >
                                <Send className="w-4 h-4" />
                                Send
                              </Button>}
                            <Button
    size="sm"
    variant="outline"
    onClick={() => handleDeleteLetter(app.id)}
    className="text-red-600 hover:text-red-700"
  >
                              <X className="w-4 h-4" />
                            </Button>
                          </> : <Button
    size="sm"
    onClick={() => setUploadingFor(app.id)}
    className="gap-1"
  >
                            <Upload className="w-4 h-4" />
                            Upload Letter
                          </Button>}
                      </div>
                    </td>
                  </tr>)}
            </tbody>
          </table>
        </div>
      </Card>

      {
    /* Summary */
  }
      {filteredApplications.length > 0 && <div className="text-sm text-slate-600 text-center">
          Showing {filteredApplications.length} of {applications.length} students with roll numbers
        </div>}
    </div>;
}
export {
  AdmissionLetterManagement
};
