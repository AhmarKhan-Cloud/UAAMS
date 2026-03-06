import { useState } from "react";
import { School, MapPin, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { ApplicationFormModal } from "./ApplicationFormModal";
const mockUniversities = [
  {
    id: "1",
    name: "National University of Sciences and Technology (NUST)",
    location: "Islamabad",
    programs: ["Computer Science", "Electrical Engineering", "Mechanical Engineering"],
    feeRange: "PKR 400,000 - 500,000/year",
    requiredAggregate: 75,
    deadline: "June 30, 2025",
    matchScore: 95,
    type: "Public"
  },
  {
    id: "2",
    name: "Lahore University of Management Sciences (LUMS)",
    location: "Lahore",
    programs: ["Computer Science", "Business Administration", "Economics"],
    feeRange: "PKR 600,000 - 800,000/year",
    requiredAggregate: 80,
    deadline: "July 15, 2025",
    matchScore: 88,
    type: "Private"
  },
  {
    id: "3",
    name: "FAST National University",
    location: "Islamabad, Lahore, Karachi",
    programs: ["Computer Science", "Software Engineering", "Data Science"],
    feeRange: "PKR 250,000 - 350,000/year",
    requiredAggregate: 70,
    deadline: "July 20, 2025",
    matchScore: 92,
    type: "Public"
  },
  {
    id: "4",
    name: "University of Engineering and Technology (UET)",
    location: "Lahore",
    programs: ["Civil Engineering", "Electrical Engineering", "Architecture"],
    feeRange: "PKR 150,000 - 250,000/year",
    requiredAggregate: 72,
    deadline: "June 25, 2025",
    matchScore: 85,
    type: "Public"
  },
  {
    id: "5",
    name: "COMSATS University",
    location: "Islamabad, Lahore, Abbottabad",
    programs: ["Computer Science", "Business Administration", "Bioinformatics"],
    feeRange: "PKR 200,000 - 300,000/year",
    requiredAggregate: 68,
    deadline: "July 10, 2025",
    matchScore: 90,
    type: "Public"
  },
  {
    id: "6",
    name: "Air University",
    location: "Islamabad",
    programs: ["Aerospace Engineering", "Computer Science", "Electrical Engineering"],
    feeRange: "PKR 300,000 - 400,000/year",
    requiredAggregate: 73,
    deadline: "July 5, 2025",
    matchScore: 87,
    type: "Public"
  }
];
function UniversityRecommendations() {
  const [selectedFilters, setSelectedFilters] = useState({
    type: "all",
    minAggregate: 0,
    maxFee: 1e6
  });
  const filteredUniversities = mockUniversities.filter((uni) => {
    if (selectedFilters.type !== "all" && uni.type.toLowerCase() !== selectedFilters.type) {
      return false;
    }
    if (uni.requiredAggregate > selectedFilters.minAggregate) {
    }
    return true;
  }).sort((a, b) => b.matchScore - a.matchScore);
  return <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">University Recommendations</h1>
        <p className="text-slate-600">Universities matched based on your academic profile</p>
      </div>

      {
    /* Filters */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Filter Universities</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">University Type</label>
            <select
    value={selectedFilters.type}
    onChange={(e) => setSelectedFilters({ ...selectedFilters, type: e.target.value })}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
  >
              <option value="all">All Universities</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Minimum Aggregate</label>
            <input
    type="number"
    value={selectedFilters.minAggregate}
    onChange={(e) => setSelectedFilters({ ...selectedFilters, minAggregate: parseInt(e.target.value) || 0 })}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    placeholder="e.g., 70"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Maximum Fee (PKR/year)</label>
            <input
    type="number"
    value={selectedFilters.maxFee}
    onChange={(e) => setSelectedFilters({ ...selectedFilters, maxFee: parseInt(e.target.value) || 1e6 })}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    placeholder="e.g., 500000"
  />
          </div>
        </div>
      </div>

      {
    /* Match Score Info */
  }
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-emerald-600 mt-1" />
          <div>
            <h3 className="text-emerald-900 mb-1">Match Score Explanation</h3>
            <p className="text-emerald-700 text-sm">
              Universities are ranked based on your aggregate, eligibility criteria, program availability, and preferences. Higher scores indicate better matches.
            </p>
          </div>
        </div>
      </div>

      {
    /* Universities List */
  }
      <div className="space-y-4">
        {filteredUniversities.map((university) => <UniversityCard key={university.id} university={university} />)}
      </div>
    </div>;
}
function UniversityCard({ university }) {
  const [expanded, setExpanded] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const handleApplyClick = (program) => {
    setSelectedProgram(program);
    setShowApplicationForm(true);
  };
  const handleSubmitApplication = (formData) => {
    const storedForm2 = localStorage.getItem(`applicationForm_${university.id}`);
    const formFields = storedForm2 ? JSON.parse(storedForm2) : [];
    const application = {
      id: `APP-${Date.now()}`,
      studentName: formData["1"] || formData["Full Name"] || "Student",
      email: formData["2"] || formData["Email"] || "",
      program: selectedProgram,
      aggregate: parseFloat(formData["aggregate"] || "0"),
      matricMarks: parseFloat(formData["matric"] || "0"),
      interMarks: parseFloat(formData["fsc"] || "0"),
      testScore: 0,
      appliedDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: "pending",
      cnic: formData["4"] || formData["CNIC"] || "",
      formData
    };
    const existingApps = localStorage.getItem(`applications_${university.id}`);
    const apps = existingApps ? JSON.parse(existingApps) : [];
    apps.push(application);
    localStorage.setItem(`applications_${university.id}`, JSON.stringify(apps));
    const studentApps = localStorage.getItem("student_applications") || "[]";
    const studentApplications = JSON.parse(studentApps);
    studentApplications.push({
      ...application,
      universityName: university.name,
      universityId: university.id
    });
    localStorage.setItem("student_applications", JSON.stringify(studentApplications));
    setShowApplicationForm(false);
    alert(`Application submitted successfully to ${university.name} for ${selectedProgram}!`);
  };
  const storedForm = localStorage.getItem(`applicationForm_${university.id}`);
  const universityFormFields = storedForm ? JSON.parse(storedForm) : [
    { id: "1", label: "Full Name", type: "text", required: true, placeholder: "Enter your full name" },
    { id: "2", label: "Email Address", type: "email", required: true, placeholder: "your.email@example.com" },
    { id: "3", label: "Phone Number", type: "tel", required: true, placeholder: "+92-300-1234567" },
    { id: "4", label: "CNIC/B-Form Number", type: "text", required: true, placeholder: "12345-1234567-1" },
    { id: "5", label: "Father Name", type: "text", required: true, placeholder: "Enter father's name" },
    { id: "6", label: "Date of Birth", type: "date", required: true },
    { id: "7", label: "Matric Marks", type: "number", required: true, placeholder: "Total marks obtained" },
    { id: "8", label: "FSc/A-Level Marks", type: "number", required: true, placeholder: "Total marks obtained" }
  ];
  return <div className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <School className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-slate-900 mb-1">{university.name}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {university.location}
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                    {university.type}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-emerald-600 mb-1">Match Score</div>
            <div className="text-3xl text-emerald-700">{university.matchScore}%</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <InfoItem
    icon={<DollarSign className="w-4 h-4" />}
    label="Fee Range"
    value={university.feeRange}
  />
          <InfoItem
    icon={<TrendingUp className="w-4 h-4" />}
    label="Required Aggregate"
    value={`${university.requiredAggregate}%+`}
  />
          <InfoItem
    icon={<Calendar className="w-4 h-4" />}
    label="Deadline"
    value={university.deadline}
  />
        </div>

        {expanded && <div className="border-t border-slate-200 pt-4 mt-4">
            <h4 className="text-slate-900 mb-2">Available Programs</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {university.programs.map((program) => <button
    key={program}
    onClick={() => handleApplyClick(program)}
    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
  >
                  {program}
                </button>)}
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-emerald-800 text-sm">
                Click on a program above to apply directly
              </p>
            </div>
          </div>}

        <button
    onClick={() => setExpanded(!expanded)}
    className="mt-4 text-emerald-600 hover:text-emerald-700 text-sm"
  >
          {expanded ? "Show Less" : "Show More Details"} →
        </button>
      </div>

      {showApplicationForm && <ApplicationFormModal
    universityName={university.name}
    programName={selectedProgram}
    formFields={universityFormFields}
    onClose={() => setShowApplicationForm(false)}
    onSubmit={handleSubmitApplication}
  />}
    </div>;
}
function InfoItem({ icon, label, value }) {
  return <div className="flex items-start gap-2">
      <div className="text-slate-400 mt-1">{icon}</div>
      <div>
        <div className="text-slate-600 text-xs">{label}</div>
        <div className="text-slate-900 text-sm">{value}</div>
      </div>
    </div>;
}
export {
  UniversityRecommendations
};
