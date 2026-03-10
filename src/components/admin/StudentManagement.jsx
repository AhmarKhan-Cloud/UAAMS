import { useState } from "react";
import { Eye, GraduationCap, Mail, Phone, MapPin, BookOpen, Award } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingStudent, setViewingStudent] = useState(null);
  const [students] = useState([
    {
      id: "1",
      name: "Muhammad Ali",
      email: "ali@example.com",
      phone: "+92-300-1234567",
      city: "Islamabad",
      registrationDate: "February 15, 2026",
      matricMarks: "1050/1100",
      fscMarks: "980/1100",
      applicationsCount: 5,
      status: "active"
    },
    {
      id: "2",
      name: "Ayesha Khan",
      email: "ayesha.khan@example.com",
      phone: "+92-321-9876543",
      city: "Lahore",
      registrationDate: "February 20, 2026",
      matricMarks: "1080/1100",
      fscMarks: "1020/1100",
      applicationsCount: 8,
      status: "active"
    },
    {
      id: "3",
      name: "Hassan Ahmed",
      email: "hassan@example.com",
      phone: "+92-333-4567890",
      city: "Karachi",
      registrationDate: "March 1, 2026",
      matricMarks: "950/1100",
      fscMarks: "890/1100",
      applicationsCount: 3,
      status: "active"
    },
    {
      id: "4",
      name: "Fatima Malik",
      email: "fatima.malik@example.com",
      phone: "+92-345-1122334",
      city: "Rawalpindi",
      registrationDate: "February 28, 2026",
      matricMarks: "1020/1100",
      fscMarks: "950/1100",
      applicationsCount: 6,
      status: "active"
    },
    {
      id: "5",
      name: "Usman Tariq",
      email: "usman@example.com",
      phone: "+92-300-9988776",
      city: "Faisalabad",
      registrationDate: "February 10, 2026",
      matricMarks: "990/1100",
      fscMarks: "920/1100",
      applicationsCount: 4,
      status: "active"
    }
  ]);
  const filteredStudents = students.filter(
    (student) => student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.email.toLowerCase().includes(searchQuery.toLowerCase()) || student.city.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const calculatePercentage = (marks) => {
    const [obtained, total] = marks.split("/").map(Number);
    return (obtained / total * 100).toFixed(1);
  };
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div>
        <h1 className="text-slate-900 mb-2">Student Management</h1>
        <p className="text-slate-600">
          View and manage all registered students in the system
        </p>
      </div>

      {
    /* Stats */
  }
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-white border border-slate-200 p-6">
          <div className="text-slate-600 text-sm mb-1">Total Students</div>
          <div className="text-slate-900 text-3xl">{students.length.toLocaleString()}</div>
        </Card>
        <Card className="bg-green-50 border-green-200 p-6">
          <div className="text-green-700 text-sm mb-1">Active Students</div>
          <div className="text-green-900 text-3xl">
            {students.filter((s) => s.status === "active").length.toLocaleString()}
          </div>
        </Card>
        <Card className="bg-blue-50 border-blue-200 p-6">
          <div className="text-blue-700 text-sm mb-1">Total Applications</div>
          <div className="text-blue-900 text-3xl">
            {students.reduce((sum, s) => sum + s.applicationsCount, 0).toLocaleString()}
          </div>
        </Card>
        <Card className="bg-purple-50 border-purple-200 p-6">
          <div className="text-purple-700 text-sm mb-1">New This Month</div>
          <div className="text-purple-900 text-3xl">145</div>
        </Card>
      </div>

      {
    /* Search */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <Input
    placeholder="Search by name, email, or city..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
      </Card>

      {
    /* Students List */
  }
      <div className="space-y-4">
        {filteredStudents.map((student) => <Card key={student.id} className="bg-white border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    {student.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">{student.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                      <span className="text-slate-500 text-sm">
                        Registered: {student.registrationDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{student.city}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="text-sm">
                    <span className="text-slate-500">Matric: </span>
                    <span className="text-slate-900 font-medium">
                      {student.matricMarks} ({calculatePercentage(student.matricMarks)}%)
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">FSc: </span>
                    <span className="text-slate-900 font-medium">
                      {student.fscMarks} ({calculatePercentage(student.fscMarks)}%)
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-slate-500">Applications: </span>
                    <span className="text-slate-900 font-medium">{student.applicationsCount}</span>
                  </div>
                </div>

                <Button
    size="sm"
    variant="outline"
    onClick={() => setViewingStudent(student)}
    className="gap-2"
  >
                  <Eye className="w-4 h-4" />
                  View Full Profile
                </Button>
              </div>
            </div>
          </Card>)}
      </div>

      {
    /* Empty State */
  }
      {filteredStudents.length === 0 && <Card className="bg-white border border-slate-200 p-12 text-center">
          <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">No students found</h3>
          <p className="text-slate-600">
            Try adjusting your search query
          </p>
        </Card>}

      {
    /* View Student Details Modal */
  }
      <Dialog open={!!viewingStudent} onOpenChange={(open) => !open && setViewingStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Profile</DialogTitle>
            <DialogDescription>
              View detailed information about the student.
            </DialogDescription>
          </DialogHeader>

          {viewingStudent && <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {viewingStudent.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-slate-900 text-xl mb-1">{viewingStudent.name}</h3>
                  <Badge className="bg-green-100 text-green-700">Active Student</Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Email Address</div>
                  <div className="text-slate-900">{viewingStudent.email}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Phone Number</div>
                  <div className="text-slate-900">{viewingStudent.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">City</div>
                  <div className="text-slate-900">{viewingStudent.city}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Registration Date</div>
                  <div className="text-slate-900">{viewingStudent.registrationDate}</div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-slate-900 mb-3">Academic Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-blue-50 border-blue-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <div className="text-xs text-blue-700">Matriculation</div>
                    </div>
                    <div className="text-blue-900 font-semibold">{viewingStudent.matricMarks}</div>
                    <div className="text-sm text-blue-700">{calculatePercentage(viewingStudent.matricMarks)}%</div>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-purple-600" />
                      <div className="text-xs text-purple-700">Intermediate (FSc)</div>
                    </div>
                    <div className="text-purple-900 font-semibold">{viewingStudent.fscMarks}</div>
                    <div className="text-sm text-purple-700">{calculatePercentage(viewingStudent.fscMarks)}%</div>
                  </Card>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-slate-900 mb-3">Application Statistics</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Total Applications</div>
                    <div className="text-slate-900 text-2xl font-bold">{viewingStudent.applicationsCount}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Pending</div>
                    <div className="text-slate-900 text-2xl font-bold">2</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Accepted</div>
                    <div className="text-slate-900 text-2xl font-bold">1</div>
                  </div>
                </div>
              </div>
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
}
export {
  StudentManagement
};
