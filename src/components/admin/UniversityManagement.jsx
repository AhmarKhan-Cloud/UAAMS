import { useState } from "react";
import { CheckCircle, XCircle, Eye, Mail, Phone, MapPin, User } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
function UniversityManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewingRequest, setViewingRequest] = useState(null);
  const [universities, setUniversities] = useState([
    {
      id: "1",
      universityName: "FAST University Islamabad",
      representativeName: "Dr. Ahmed Hassan",
      email: "ahmed.hassan@nu.edu.pk",
      phone: "+92-51-9247000",
      location: "Islamabad, Pakistan",
      website: "www.nu.edu.pk",
      establishedYear: "2000",
      registrationDate: "March 1, 2026",
      status: "pending",
      studentCount: "5000+",
      programsOffered: "Computer Science, Software Engineering, Electrical Engineering"
    },
    {
      id: "2",
      universityName: "COMSATS University Lahore",
      representativeName: "Prof. Sarah Khan",
      email: "sarah.khan@comsats.edu.pk",
      phone: "+92-42-111-001-007",
      location: "Lahore, Pakistan",
      website: "www.comsats.edu.pk",
      establishedYear: "1998",
      registrationDate: "March 2, 2026",
      status: "pending",
      studentCount: "8000+",
      programsOffered: "CS, SE, EE, BBA, Finance"
    },
    {
      id: "3",
      universityName: "University of Engineering Karachi",
      representativeName: "Dr. Ali Raza",
      email: "ali.raza@uek.edu.pk",
      phone: "+92-21-99261261",
      location: "Karachi, Pakistan",
      website: "www.uek.edu.pk",
      establishedYear: "1995",
      registrationDate: "February 28, 2026",
      status: "pending",
      studentCount: "6500+",
      programsOffered: "Mechanical, Civil, Electrical, Chemical Engineering"
    },
    {
      id: "4",
      universityName: "NUST University",
      representativeName: "Dr. Muhammad Farooq",
      email: "farooq@nust.edu.pk",
      phone: "+92-51-9085-5000",
      location: "Islamabad, Pakistan",
      website: "www.nust.edu.pk",
      establishedYear: "1991",
      registrationDate: "February 15, 2026",
      status: "approved",
      studentCount: "12000+",
      programsOffered: "Engineering, Business, Medicine, Social Sciences"
    },
    {
      id: "5",
      universityName: "Punjab University Lahore",
      representativeName: "Prof. Sadia Ahmed",
      email: "sadia@pu.edu.pk",
      phone: "+92-42-99231581",
      location: "Lahore, Pakistan",
      website: "www.pu.edu.pk",
      establishedYear: "1882",
      registrationDate: "February 10, 2026",
      status: "approved",
      studentCount: "15000+",
      programsOffered: "All major disciplines"
    }
  ]);
  const handleApprove = (id) => {
    if (confirm("Are you sure you want to approve this university registration?")) {
      setUniversities(universities.map(
        (uni) => uni.id === id ? { ...uni, status: "approved" } : uni
      ));
      setViewingRequest(null);
    }
  };
  const handleReject = (id) => {
    if (confirm("Are you sure you want to reject this university registration?")) {
      setUniversities(universities.map(
        (uni) => uni.id === id ? { ...uni, status: "rejected" } : uni
      ));
      setViewingRequest(null);
    }
  };
  const filteredUniversities = universities.filter((uni) => {
    const matchesSearch = uni.universityName.toLowerCase().includes(searchQuery.toLowerCase()) || uni.representativeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || uni.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const pendingCount = universities.filter((u) => u.status === "pending").length;
  const approvedCount = universities.filter((u) => u.status === "approved").length;
  const rejectedCount = universities.filter((u) => u.status === "rejected").length;
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div>
        <h1 className="text-slate-900 mb-2">University Management</h1>
        <p className="text-slate-600">
          Manage university registrations and approve new institutions
        </p>
      </div>

      {
    /* Stats */
  }
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-white border border-slate-200 p-6">
          <div className="text-slate-600 text-sm mb-1">Total Registered</div>
          <div className="text-slate-900 text-3xl">{universities.length}</div>
        </Card>
        <Card className="bg-orange-50 border-orange-200 p-6">
          <div className="text-orange-700 text-sm mb-1">Pending Approval</div>
          <div className="text-orange-900 text-3xl">{pendingCount}</div>
        </Card>
        <Card className="bg-green-50 border-green-200 p-6">
          <div className="text-green-700 text-sm mb-1">Approved</div>
          <div className="text-green-900 text-3xl">{approvedCount}</div>
        </Card>
        <Card className="bg-red-50 border-red-200 p-6">
          <div className="text-red-700 text-sm mb-1">Rejected</div>
          <div className="text-red-900 text-3xl">{rejectedCount}</div>
        </Card>
      </div>

      {
    /* Filters */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
    placeholder="Search by university or representative name..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
          </div>
          <div className="flex gap-2">
            <Button
    variant={filterStatus === "all" ? "default" : "outline"}
    onClick={() => setFilterStatus("all")}
    size="sm"
  >
              All
            </Button>
            <Button
    variant={filterStatus === "pending" ? "default" : "outline"}
    onClick={() => setFilterStatus("pending")}
    size="sm"
    className={filterStatus === "pending" ? "bg-orange-600 hover:bg-orange-700" : ""}
  >
              Pending ({pendingCount})
            </Button>
            <Button
    variant={filterStatus === "approved" ? "default" : "outline"}
    onClick={() => setFilterStatus("approved")}
    size="sm"
    className={filterStatus === "approved" ? "bg-green-600 hover:bg-green-700" : ""}
  >
              Approved
            </Button>
            <Button
    variant={filterStatus === "rejected" ? "default" : "outline"}
    onClick={() => setFilterStatus("rejected")}
    size="sm"
    className={filterStatus === "rejected" ? "bg-red-600 hover:bg-red-700" : ""}
  >
              Rejected
            </Button>
          </div>
        </div>
      </Card>

      {
    /* Universities List */
  }
      <div className="space-y-4">
        {filteredUniversities.map((uni) => <Card key={uni.id} className="bg-white border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                    {uni.universityName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">{uni.universityName}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
    className={uni.status === "pending" ? "bg-orange-100 text-orange-700" : uni.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
  >
                        {uni.status.charAt(0).toUpperCase() + uni.status.slice(1)}
                      </Badge>
                      <span className="text-slate-500 text-sm">
                        Registered: {uni.registrationDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-4 h-4" />
                    <span>{uni.representativeName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{uni.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{uni.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{uni.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
    size="sm"
    variant="outline"
    onClick={() => setViewingRequest(uni)}
    className="gap-2"
  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                  
                  {uni.status === "pending" && <>
                      <Button
    size="sm"
    onClick={() => handleApprove(uni.id)}
    className="gap-2 bg-green-600 hover:bg-green-700"
  >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button
    size="sm"
    variant="outline"
    onClick={() => handleReject(uni.id)}
    className="gap-2 text-red-600 hover:text-red-700"
  >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </>}
                </div>
              </div>
            </div>
          </Card>)}
      </div>

      {
    /* Empty State */
  }
      {filteredUniversities.length === 0 && <Card className="bg-white border border-slate-200 p-12 text-center">
          <School className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">No universities found</h3>
          <p className="text-slate-600">
            {searchQuery ? "Try adjusting your search query" : "No universities match the selected filter"}
          </p>
        </Card>}

      {
    /* View Details Modal */
  }
      <Dialog open={!!viewingRequest} onOpenChange={(open) => !open && setViewingRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>University Registration Details</DialogTitle>
            <DialogDescription>
              Review the complete information submitted by the university.
            </DialogDescription>
          </DialogHeader>

          {viewingRequest && <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                  {viewingRequest.universityName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-slate-900 text-xl mb-1">{viewingRequest.universityName}</h3>
                  <Badge
    className={viewingRequest.status === "pending" ? "bg-orange-100 text-orange-700" : viewingRequest.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
  >
                    {viewingRequest.status.charAt(0).toUpperCase() + viewingRequest.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Representative Name</div>
                  <div className="text-slate-900">{viewingRequest.representativeName}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Email Address</div>
                  <div className="text-slate-900">{viewingRequest.email}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Phone Number</div>
                  <div className="text-slate-900">{viewingRequest.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Location</div>
                  <div className="text-slate-900">{viewingRequest.location}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Website</div>
                  <div className="text-blue-600">{viewingRequest.website}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Established Year</div>
                  <div className="text-slate-900">{viewingRequest.establishedYear}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Student Count</div>
                  <div className="text-slate-900">{viewingRequest.studentCount}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Registration Date</div>
                  <div className="text-slate-900">{viewingRequest.registrationDate}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 mb-1">Programs Offered</div>
                <div className="text-slate-900">{viewingRequest.programsOffered}</div>
              </div>

              {viewingRequest.status === "pending" && <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button
    onClick={() => handleApprove(viewingRequest.id)}
    className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Registration
                  </Button>
                  <Button
    variant="outline"
    onClick={() => handleReject(viewingRequest.id)}
    className="flex-1 gap-2 text-red-600 hover:text-red-700"
  >
                    <XCircle className="w-4 h-4" />
                    Reject Registration
                  </Button>
                </div>}

              {viewingRequest.status === "approved" && <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">This university has been approved and can access the system.</span>
                  </div>
                </div>}

              {viewingRequest.status === "rejected" && <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">This university registration has been rejected.</span>
                  </div>
                </div>}
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
}
export {
  UniversityManagement
};
