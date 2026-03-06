import { Card } from "./ui/card";
import { Users, School, PenTool, CheckCircle, TrendingUp, FileText, AlertCircle } from "lucide-react";
function AdminOverview() {
  const stats = {
    totalUniversities: 45,
    pendingApprovals: 3,
    totalStudents: 12458,
    totalBloggers: 87,
    totalApplications: 34521,
    activeApplications: 2341
  };
  const recentActivities = [
    {
      id: "1",
      type: "university_request",
      message: "New university registration: FAST University Islamabad",
      time: "5 minutes ago",
      icon: <School className="w-4 h-4 text-blue-600" />,
      color: "bg-blue-100"
    },
    {
      id: "2",
      type: "student",
      message: "45 new student registrations today",
      time: "1 hour ago",
      icon: <Users className="w-4 h-4 text-green-600" />,
      color: "bg-green-100"
    },
    {
      id: "3",
      type: "blogger",
      message: "UET Lahore hired 2 new bloggers",
      time: "3 hours ago",
      icon: <PenTool className="w-4 h-4 text-purple-600" />,
      color: "bg-purple-100"
    },
    {
      id: "4",
      type: "university_approved",
      message: "Approved: COMSATS University Abbottabad",
      time: "5 hours ago",
      icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
      color: "bg-emerald-100"
    }
  ];
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div>
        <h1 className="text-slate-900 mb-2">Admin Dashboard</h1>
        <p className="text-slate-600">
          Complete overview and management of the UAAMS platform
        </p>
      </div>

      {
    /* Alert for Pending Approvals */
  }
      {stats.pendingApprovals > 0 && <Card className="bg-orange-50 border-orange-200 p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <div className="font-medium text-orange-900">
                {stats.pendingApprovals} University Registration{stats.pendingApprovals > 1 ? "s" : ""} Pending Approval
              </div>
              <div className="text-sm text-orange-700">
                Review and approve pending university registration requests
              </div>
            </div>
          </div>
        </Card>}

      {
    /* Stats Grid */
  }
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <School className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              +{stats.pendingApprovals} pending
            </span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalUniversities}</div>
          <div className="text-blue-100 text-sm">Total Universities</div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5 opacity-80" />
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalStudents.toLocaleString()}</div>
          <div className="text-emerald-100 text-sm">Total Students</div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <PenTool className="w-8 h-8 opacity-80" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Active</span>
          </div>
          <div className="text-3xl font-bold mb-1">{stats.totalBloggers}</div>
          <div className="text-purple-100 text-sm">Content Bloggers</div>
        </Card>
      </div>

      {
    /* Secondary Stats */
  }
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-slate-600 text-sm">Total Applications</div>
                <div className="text-slate-900 text-2xl font-bold">{stats.totalApplications.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            Across all universities and programs
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-slate-600 text-sm">Active Applications</div>
                <div className="text-slate-900 text-2xl font-bold">{stats.activeApplications.toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            Currently being processed
          </div>
        </Card>
      </div>

      {
    /* Recent Activities */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h2 className="text-slate-900 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
              <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <div className="text-slate-900 text-sm">{activity.message}</div>
                <div className="text-slate-500 text-xs mt-1">{activity.time}</div>
              </div>
            </div>)}
        </div>
      </Card>

      {
    /* Quick Stats */
  }
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-200 p-4">
          <div className="text-slate-600 text-xs mb-1">Approval Rate</div>
          <div className="text-slate-900 text-xl font-bold">94.2%</div>
        </Card>
        <Card className="bg-white border border-slate-200 p-4">
          <div className="text-slate-600 text-xs mb-1">Avg. Processing Time</div>
          <div className="text-slate-900 text-xl font-bold">2.4 days</div>
        </Card>
        <Card className="bg-white border border-slate-200 p-4">
          <div className="text-slate-600 text-xs mb-1">Blog Posts</div>
          <div className="text-slate-900 text-xl font-bold">1,234</div>
        </Card>
        <Card className="bg-white border border-slate-200 p-4">
          <div className="text-slate-600 text-xs mb-1">System Uptime</div>
          <div className="text-slate-900 text-xl font-bold">99.8%</div>
        </Card>
      </div>
    </div>;
}
export {
  AdminOverview
};
