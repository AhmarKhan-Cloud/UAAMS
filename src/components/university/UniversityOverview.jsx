import { Users, FileText, CheckCircle, Clock, TrendingUp, Calendar } from "lucide-react";
function UniversityOverview({ onNavigate }) {
  return <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">University Dashboard</h1>
        <p className="text-slate-600">Manage admissions and applications from one central location</p>
      </div>

      {
    /* Stats Grid */
  }
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
    icon={<Users className="w-8 h-8 text-blue-600" />}
    title="Total Applications"
    value="1,247"
    change="+12%"
    changeType="positive"
    bgColor="bg-blue-50"
  />
        <StatCard
    icon={<Clock className="w-8 h-8 text-amber-600" />}
    title="Pending Review"
    value="342"
    change="+5%"
    changeType="neutral"
    bgColor="bg-amber-50"
  />
        <StatCard
    icon={<CheckCircle className="w-8 h-8 text-emerald-600" />}
    title="Accepted"
    value="678"
    change="+18%"
    changeType="positive"
    bgColor="bg-emerald-50"
  />
        <StatCard
    icon={<FileText className="w-8 h-8 text-purple-600" />}
    title="Programs Active"
    value="24"
    change="0%"
    changeType="neutral"
    bgColor="bg-purple-50"
  />
      </div>

      {
    /* Recent Activity */
  }
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4">Recent Applications</h3>
          <div className="space-y-3">
            <ApplicationItem
    name="Ahmed Hassan"
    program="Computer Science"
    aggregate="85%"
    time="5 min ago"
  />
            <ApplicationItem
    name="Fatima Khan"
    program="Electrical Engineering"
    aggregate="82%"
    time="12 min ago"
  />
            <ApplicationItem
    name="Ali Raza"
    program="Software Engineering"
    aggregate="88%"
    time="25 min ago"
  />
            <ApplicationItem
    name="Sara Ahmed"
    program="Business Administration"
    aggregate="79%"
    time="1 hour ago"
  />
          </div>
          <button
    onClick={() => onNavigate?.("applications")}
    className="mt-4 text-blue-600 hover:text-blue-700 text-sm"
  >
            View All Applications →
          </button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4">Application Trends</h3>
          <div className="space-y-4">
            <TrendItem
    program="Computer Science"
    applications={385}
    percentage={31}
    color="bg-blue-500"
  />
            <TrendItem
    program="Electrical Engineering"
    applications={245}
    percentage={20}
    color="bg-emerald-500"
  />
            <TrendItem
    program="Business Administration"
    applications={198}
    percentage={16}
    color="bg-purple-500"
  />
            <TrendItem
    program="Software Engineering"
    applications={187}
    percentage={15}
    color="bg-amber-500"
  />
            <TrendItem
    program="Other Programs"
    applications={232}
    percentage={18}
    color="bg-slate-400"
  />
          </div>
        </div>
      </div>

      {
    /* Upcoming Deadlines */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Upcoming Deadlines</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <DeadlineCard
    title="Application Deadline"
    date="June 30, 2025"
    daysLeft={15}
    type="critical"
  />
          <DeadlineCard
    title="Merit List Publication"
    date="July 5, 2025"
    daysLeft={20}
    type="important"
  />
          <DeadlineCard
    title="Document Verification"
    date="July 15, 2025"
    daysLeft={30}
    type="normal"
  />
        </div>
      </div>

      {
    /* Quick Actions */
  }
      <div className="grid md:grid-cols-3 gap-6">
        <ActionCard
    title="Publish Announcement"
    description="Share important updates with applicants"
    buttonText="Create Announcement"
    buttonColor="bg-blue-600 hover:bg-blue-700"
    onClick={() => onNavigate?.("announcements")}
  />
        <ActionCard
    title="Upload Merit List"
    description="Publish merit list for programs"
    buttonText="Upload List"
    buttonColor="bg-emerald-600 hover:bg-emerald-700"
    onClick={() => onNavigate?.("roll-numbers")}
  />
        <ActionCard
    title="Configure Forms"
    description="Update admission form fields"
    buttonText="Manage Forms"
    buttonColor="bg-purple-600 hover:bg-purple-700"
    onClick={() => onNavigate?.("form-builder")}
  />
      </div>
    </div>;
}
function StatCard({
  icon,
  title,
  value,
  change,
  changeType,
  bgColor
}) {
  const changeColor = changeType === "positive" ? "text-emerald-600" : changeType === "negative" ? "text-red-600" : "text-slate-600";
  return <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <div className="text-slate-600 text-sm mb-1">{title}</div>
      <div className="flex items-end justify-between">
        <div className="text-slate-900 text-3xl">{value}</div>
        <div className={`text-sm flex items-center gap-1 ${changeColor}`}>
          <TrendingUp className="w-4 h-4" />
          {change}
        </div>
      </div>
    </div>;
}
function ApplicationItem({
  name,
  program,
  aggregate,
  time
}) {
  return <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
      <div>
        <div className="text-slate-900">{name}</div>
        <div className="text-slate-600 text-sm">{program}</div>
      </div>
      <div className="text-right">
        <div className="text-emerald-600">{aggregate}</div>
        <div className="text-slate-500 text-xs">{time}</div>
      </div>
    </div>;
}
function TrendItem({
  program,
  applications,
  percentage,
  color
}) {
  return <div>
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-slate-700">{program}</span>
        <span className="text-slate-600">{applications} applications</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
    className={`${color} h-2 rounded-full transition-all`}
    style={{ width: `${percentage}%` }}
  />
      </div>
    </div>;
}
function DeadlineCard({
  title,
  date,
  daysLeft,
  type
}) {
  const getTypeStyles = () => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50";
      case "important":
        return "border-amber-200 bg-amber-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };
  return <div className={`border rounded-lg p-4 ${getTypeStyles()}`}>
      <div className="flex items-start gap-3">
        <Calendar className="w-5 h-5 text-slate-600 mt-1" />
        <div>
          <div className="text-slate-900 mb-1">{title}</div>
          <div className="text-slate-600 text-sm mb-2">{date}</div>
          <div className="text-slate-700">{daysLeft} days left</div>
        </div>
      </div>
    </div>;
}
function ActionCard({
  title,
  description,
  buttonText,
  buttonColor,
  onClick
}) {
  return <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm mb-4">{description}</p>
      <button
    onClick={onClick}
    className={`w-full px-4 py-2 text-white rounded-lg transition-colors ${buttonColor}`}
  >
        {buttonText}
      </button>
    </div>;
}
export {
  UniversityOverview
};
