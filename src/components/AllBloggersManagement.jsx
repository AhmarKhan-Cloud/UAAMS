import { useState } from "react";
import { Eye, PenTool, Mail, Phone, Building2, Calendar } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
function AllBloggersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewingBlogger, setViewingBlogger] = useState(null);
  const [bloggers] = useState([
    {
      id: "1",
      name: "Ahmed Khan",
      email: "ahmed.khan@example.com",
      universityName: "NUST University",
      phone: "+92-300-1234567",
      postsCount: 12,
      status: "active",
      dateAdded: "January 15, 2025",
      loginId: "blogger_ahmed_khan"
    },
    {
      id: "2",
      name: "Sara Ali",
      email: "sara.ali@example.com",
      universityName: "NUST University",
      phone: "+92-321-9876543",
      postsCount: 8,
      status: "active",
      dateAdded: "February 1, 2025",
      loginId: "blogger_sara_ali"
    },
    {
      id: "3",
      name: "Hassan Raza",
      email: "hassan@example.com",
      universityName: "Punjab University Lahore",
      phone: "+92-333-5566778",
      postsCount: 15,
      status: "active",
      dateAdded: "January 20, 2025",
      loginId: "blogger_hassan_raza"
    },
    {
      id: "4",
      name: "Ayesha Malik",
      email: "ayesha.malik@example.com",
      universityName: "COMSATS Islamabad",
      phone: "+92-345-9988776",
      postsCount: 6,
      status: "inactive",
      dateAdded: "February 10, 2025",
      loginId: "blogger_ayesha_malik"
    },
    {
      id: "5",
      name: "Bilal Ahmed",
      email: "bilal@example.com",
      universityName: "FAST University Lahore",
      phone: "+92-300-4455667",
      postsCount: 10,
      status: "active",
      dateAdded: "January 5, 2025",
      loginId: "blogger_bilal_ahmed"
    }
  ]);
  const filteredBloggers = bloggers.filter((blogger) => {
    const matchesSearch = blogger.name.toLowerCase().includes(searchQuery.toLowerCase()) || blogger.email.toLowerCase().includes(searchQuery.toLowerCase()) || blogger.universityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || blogger.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  const activeCount = bloggers.filter((b) => b.status === "active").length;
  const inactiveCount = bloggers.filter((b) => b.status === "inactive").length;
  const totalPosts = bloggers.reduce((sum, b) => sum + b.postsCount, 0);
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div>
        <h1 className="text-slate-900 mb-2">Bloggers Management</h1>
        <p className="text-slate-600">
          View and manage all bloggers across all universities
        </p>
      </div>

      {
    /* Stats */
  }
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-white border border-slate-200 p-6">
          <div className="text-slate-600 text-sm mb-1">Total Bloggers</div>
          <div className="text-slate-900 text-3xl">{bloggers.length}</div>
        </Card>
        <Card className="bg-green-50 border-green-200 p-6">
          <div className="text-green-700 text-sm mb-1">Active Bloggers</div>
          <div className="text-green-900 text-3xl">{activeCount}</div>
        </Card>
        <Card className="bg-slate-50 border-slate-200 p-6">
          <div className="text-slate-600 text-sm mb-1">Inactive Bloggers</div>
          <div className="text-slate-900 text-3xl">{inactiveCount}</div>
        </Card>
        <Card className="bg-purple-50 border-purple-200 p-6">
          <div className="text-purple-700 text-sm mb-1">Total Blog Posts</div>
          <div className="text-purple-900 text-3xl">{totalPosts}</div>
        </Card>
      </div>

      {
    /* Filters */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
    placeholder="Search by name, email, or university..."
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
    variant={filterStatus === "active" ? "default" : "outline"}
    onClick={() => setFilterStatus("active")}
    size="sm"
    className={filterStatus === "active" ? "bg-green-600 hover:bg-green-700" : ""}
  >
              Active
            </Button>
            <Button
    variant={filterStatus === "inactive" ? "default" : "outline"}
    onClick={() => setFilterStatus("inactive")}
    size="sm"
  >
              Inactive
            </Button>
          </div>
        </div>
      </Card>

      {
    /* Bloggers List */
  }
      <div className="space-y-4">
        {filteredBloggers.map((blogger) => <Card key={blogger.id} className="bg-white border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    {blogger.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">{blogger.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
    className={blogger.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}
  >
                        {blogger.status.charAt(0).toUpperCase() + blogger.status.slice(1)}
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700">
                        <Building2 className="w-3 h-3 mr-1" />
                        {blogger.universityName}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{blogger.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{blogger.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>Added: {blogger.dateAdded}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    <span className="font-medium text-slate-900">{blogger.postsCount}</span> blog posts published
                  </div>

                  <Button
    size="sm"
    variant="outline"
    onClick={() => setViewingBlogger(blogger)}
    className="gap-2"
  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>)}
      </div>

      {
    /* Empty State */
  }
      {filteredBloggers.length === 0 && <Card className="bg-white border border-slate-200 p-12 text-center">
          <PenTool className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">No bloggers found</h3>
          <p className="text-slate-600">
            {searchQuery ? "Try adjusting your search query" : "No bloggers match the selected filter"}
          </p>
        </Card>}

      {
    /* View Blogger Details Modal */
  }
      <Dialog open={!!viewingBlogger} onOpenChange={(open) => !open && setViewingBlogger(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Blogger Details</DialogTitle>
            <DialogDescription>
              View detailed information about the blogger and their affiliation.
            </DialogDescription>
          </DialogHeader>

          {viewingBlogger && <div className="space-y-6 mt-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {viewingBlogger.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                </div>
                <div>
                  <h3 className="text-slate-900 text-xl mb-1">{viewingBlogger.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge
    className={viewingBlogger.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"}
  >
                      {viewingBlogger.status.charAt(0).toUpperCase() + viewingBlogger.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Email Address</div>
                  <div className="text-slate-900">{viewingBlogger.email}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Phone Number</div>
                  <div className="text-slate-900">{viewingBlogger.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">University</div>
                  <div className="text-slate-900">{viewingBlogger.universityName}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Date Added</div>
                  <div className="text-slate-900">{viewingBlogger.dateAdded}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Login ID</div>
                  <div className="text-slate-900 font-mono">{viewingBlogger.loginId}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">Blog Posts</div>
                  <div className="text-slate-900 font-semibold">{viewingBlogger.postsCount} posts</div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-slate-900 mb-3">Statistics</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-purple-50 border-purple-200 p-4">
                    <div className="text-xs text-purple-700 mb-1">Published Posts</div>
                    <div className="text-purple-900 text-2xl font-bold">{viewingBlogger.postsCount}</div>
                  </Card>
                  <Card className="bg-blue-50 border-blue-200 p-4">
                    <div className="text-xs text-blue-700 mb-1">Total Views</div>
                    <div className="text-blue-900 text-2xl font-bold">
                      {(viewingBlogger.postsCount * 523).toLocaleString()}
                    </div>
                  </Card>
                  <Card className="bg-emerald-50 border-emerald-200 p-4">
                    <div className="text-xs text-emerald-700 mb-1">Avg. Engagement</div>
                    <div className="text-emerald-900 text-2xl font-bold">87%</div>
                  </Card>
                </div>
              </div>

              {viewingBlogger.status === "active" && <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <PenTool className="w-5 h-5" />
                    <span className="font-medium">This blogger is actively creating content for {viewingBlogger.universityName}.</span>
                  </div>
                </div>}
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
}
export {
  AllBloggersManagement
};
