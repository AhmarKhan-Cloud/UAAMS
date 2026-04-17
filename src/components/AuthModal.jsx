import { useState } from "react";
import { X, GraduationCap, School, PenTool, Shield, CheckCircle2 } from "lucide-react";
import { PasswordField } from "./shared/PasswordField";
function AuthModal({ mode, role, onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // University-specific fields
    representativeName: "",
    phone: "",
    location: "",
    website: "",
    establishedYear: "",
    studentCount: "",
    programsOffered: ""
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === "university" ? formData.name : formData.name || formData.email.split("@")[0],
      email: formData.email,
      role,
      // New university registrations start as pending
      approvalStatus: role === "university" && !isLogin ? "pending" : "approved"
    };
    if (role === "university" && !isLogin) {
      setShowApprovalModal(true);
      return;
    }
    onLogin(user);
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleApprovalModalClose = () => {
    setShowApprovalModal(false);
    onClose();
  };
  if (showApprovalModal) {
    return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 relative">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <h2 className="text-center text-slate-900 mb-3">
            Registration Submitted!
          </h2>
          <p className="text-center text-slate-600 mb-6">
            Your university registration request has been sent to the admin for approval. 
            You will receive a notification once your registration is reviewed and approved. 
            After approval, you can login using your email and password.
          </p>

          <button
      onClick={handleApprovalModalClose}
      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
    >
            Got It
          </button>
        </div>
      </div>;
  }
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
        <button
    onClick={onClose}
    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
  >
          <X className="w-6 h-6" />
        </button>

        <div className="flex justify-center mb-6">
          {role === "student" ? <GraduationCap className="w-12 h-12 text-emerald-600" /> : role === "blogger" ? <PenTool className="w-12 h-12 text-purple-600" /> : role === "admin" ? <Shield className="w-12 h-12 text-indigo-600" /> : <School className="w-12 h-12 text-blue-600" />}
        </div>

        <h2 className="text-center text-slate-900 mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-center text-slate-600 mb-6">
          {role === "student" ? "Student Portal" : role === "blogger" ? "Blogger Portal" : role === "admin" ? "Super Admin Portal" : "University Portal"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {
    /* University Registration Fields */
  }
          {!isLogin && role === "university" && <>
              <div>
                <label className="block text-slate-700 mb-2 text-sm">
                  University Name *
                </label>
                <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder="Enter university name"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
              </div>

              <div>
                <label className="block text-slate-700 mb-2 text-sm">
                  Representative Name *
                </label>
                <input
    type="text"
    name="representativeName"
    value={formData.representativeName}
    onChange={handleChange}
    placeholder="Enter representative's full name"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2 text-sm">
                    Email Address *
                  </label>
                  <input
    type="email"
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder="university@example.com"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2 text-sm">
                    Phone Number *
                  </label>
                  <input
    type="tel"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    placeholder="+92-300-1234567"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-2 text-sm">
                  Location *
                </label>
                <input
    type="text"
    name="location"
    value={formData.location}
    onChange={handleChange}
    placeholder="City, Province"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-2 text-sm">
                    Website
                  </label>
                  <input
    type="url"
    name="website"
    value={formData.website}
    onChange={handleChange}
    placeholder="https://university.edu.pk"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2 text-sm">
                    Established Year *
                  </label>
                  <input
    type="number"
    name="establishedYear"
    value={formData.establishedYear}
    onChange={handleChange}
    placeholder="1990"
    min="1800"
    max={(/* @__PURE__ */ new Date()).getFullYear()}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-2 text-sm">
                  Student Count *
                </label>
                <input
    type="number"
    name="studentCount"
    value={formData.studentCount}
    onChange={handleChange}
    placeholder="e.g., 5000"
    min="0"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
              </div>

              <div>
                <label className="block text-slate-700 mb-2 text-sm">
                  Programs Offered *
                </label>
                <textarea
    name="programsOffered"
    value={formData.programsOffered}
    onChange={handleChange}
    placeholder="List the programs offered (e.g., Computer Science, Business Administration, Engineering)"
    rows={3}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-slate-900 mb-3 text-sm">Set Your Password</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 mb-2 text-sm">Password *</label>
                    <PasswordField
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder="Create a strong password"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
    autoComplete="new-password"
  />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 text-sm">Confirm Password *</label>
                    <PasswordField
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    placeholder="Re-enter your password"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
    autoComplete="new-password"
  />
                  </div>
                </div>
              </div>
            </>}

          {
    /* Other roles - Simple registration */
  }
          {!isLogin && role !== "university" && <div>
              <label className="block text-slate-700 mb-2 text-sm">
                {role === "student" ? "Full Name" : role === "blogger" ? "Blogger Name" : "Admin Name"}
              </label>
              <input
    type="text"
    name="name"
    value={formData.name}
    onChange={handleChange}
    placeholder={role === "student" ? "Enter your full name" : role === "blogger" ? "Enter your blogger name" : "Enter admin name"}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    required={!isLogin}
  />
            </div>}

          {
    /* Email field for non-university or login */
  }
          {(isLogin || role !== "university") && <div>
              <label className="block text-slate-700 mb-2 text-sm">
                {role === "blogger" ? "Login ID or Email" : "Email Address"}
              </label>
              <input
    type={role === "blogger" ? "text" : "email"}
    name="email"
    value={formData.email}
    onChange={handleChange}
    placeholder={role === "blogger" ? "blogger_username" : "email@example.com"}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    required
  />
            </div>}

          {
    /* Password fields for non-university or login */
  }
          {(isLogin || role !== "university") && <>
              <div>
                <label className="block text-slate-700 mb-2 text-sm">Password</label>
                <PasswordField
    name="password"
    value={formData.password}
    onChange={handleChange}
    placeholder="Enter your password"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    required
    autoComplete={isLogin ? "current-password" : "new-password"}
  />
              </div>

              {!isLogin && <div>
                  <label className="block text-slate-700 mb-2 text-sm">Confirm Password</label>
                  <PasswordField
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    placeholder="Re-enter your password"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
    required={!isLogin}
    autoComplete="new-password"
  />
                </div>}
            </>}

          <button
    type="submit"
    className={`w-full py-3 text-white rounded-lg transition-colors ${role === "student" ? "bg-emerald-600 hover:bg-emerald-700" : role === "blogger" ? "bg-purple-600 hover:bg-purple-700" : role === "admin" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-blue-600 hover:bg-blue-700"}`}
  >
            {isLogin ? "Login" : role === "university" ? "Submit Registration" : "Create Account"}
          </button>
        </form>

        {role !== "admin" && <div className="mt-6 text-center">
            <button
    onClick={() => setIsLogin(!isLogin)}
    className={`text-sm ${role === "blogger" ? "text-purple-600 hover:text-purple-700" : role === "admin" ? "text-indigo-600 hover:text-indigo-700" : role === "university" ? "text-blue-600 hover:text-blue-700" : "text-emerald-600 hover:text-emerald-700"}`}
  >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </div>}
      </div>
    </div>;
}
export {
  AuthModal
};
