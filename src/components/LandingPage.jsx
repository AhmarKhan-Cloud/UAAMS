import { GraduationCap, School, Users, TrendingUp, FileText, Bell, Shield } from "lucide-react";
import { UniversityPostsFeed } from "./UniversityPostsFeed";
function LandingPage({ onOpenAuth }) {
  return <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {
    /* Header */
  }
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-emerald-600" />
            <span className="text-emerald-900">UAAMS</span>
          </div>
          <div className="flex gap-3">
            <button
    onClick={() => onOpenAuth("login", "student")}
    className="px-4 py-2 text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
  >
              Login
            </button>
            <button
    onClick={() => onOpenAuth("login", "blogger")}
    className="px-4 py-2 text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
  >
              Blogger
            </button>
            <button
    onClick={() => onOpenAuth("login", "admin")}
    className="px-3 py-2 text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1"
  >
              <Shield className="w-4 h-4" />
              Admin
            </button>
            <button
    onClick={() => onOpenAuth("register", "student")}
    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
  >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {
    /* Hero Section */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-emerald-900 mb-6">
            Simplify Your University Admission Journey
          </h1>
          <p className="text-slate-600 mb-8">
            Apply to multiple universities across Pakistan with a single profile. UAAMS centralizes admission workflows, automates form filling, and provides personalized university recommendations based on your academic merit.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
    onClick={() => onOpenAuth("register", "student")}
    className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
  >
              Apply as Student
            </button>
            <button
    onClick={() => onOpenAuth("register", "university")}
    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
              Register University
            </button>
          </div>
        </div>
      </section>

      {
    /* Features Section */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-center text-slate-900 mb-12">Why Choose UAAMS?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
    icon={<Users className="w-12 h-12 text-emerald-600" />}
    title="Single Profile System"
    description="Create your profile once and use it to apply to multiple universities. No more repetitive data entry."
  />
          <FeatureCard
    icon={<TrendingUp className="w-12 h-12 text-blue-600" />}
    title="Smart Recommendations"
    description="Get personalized university suggestions based on your merit, eligibility, and preferences."
  />
          <FeatureCard
    icon={<FileText className="w-12 h-12 text-purple-600" />}
    title="Automated Form Filling"
    description="Your data automatically populates admission forms, saving time and reducing errors."
  />
          <FeatureCard
    icon={<Bell className="w-12 h-12 text-orange-600" />}
    title="Real-time Tracking"
    description="Track your application status and receive notifications about deadlines and updates."
  />
          <FeatureCard
    icon={<School className="w-12 h-12 text-indigo-600" />}
    title="University Portal"
    description="Universities can manage applications, publish announcements, and configure admission forms."
  />
          <FeatureCard
    icon={<GraduationCap className="w-12 h-12 text-rose-600" />}
    title="Transparent Process"
    description="Access complete information about programs, fee structures, and merit criteria in one place."
  />
        </div>
      </section>

      {
    /* Stats Section */
  }
      <section className="bg-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="50+" label="Partner Universities" />
            <StatCard number="10,000+" label="Student Applications" />
            <StatCard number="95%" label="Success Rate" />
            <StatCard number="24/7" label="Support Available" />
          </div>
        </div>
      </section>

      {
    /* University Posts Feed Section */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50">
        <div className="text-center mb-12">
          <h2 className="text-slate-900 mb-3">Latest from Universities</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Stay updated with events, open houses, and important announcements from universities across Pakistan
          </p>
        </div>
        <UniversityPostsFeed />
      </section>

      {
    /* How It Works */
  }
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-center text-slate-900 mb-12">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <StepCard
    number="1"
    title="Create Profile"
    description="Register and fill in your academic and personal details once."
  />
          <StepCard
    number="2"
    title="Get Recommendations"
    description="Receive personalized university suggestions based on your profile."
  />
          <StepCard
    number="3"
    title="Apply Instantly"
    description="Submit applications to multiple universities with one click."
  />
          <StepCard
    number="4"
    title="Track Progress"
    description="Monitor your application status and receive updates in real-time."
  />
        </div>
      </section>

      {
    /* Footer */
  }
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-6 h-6" />
                <span>UAAMS</span>
              </div>
              <p className="text-slate-400 text-sm">
                Centralizing university admissions across Pakistan
              </p>
            </div>
            <div>
              <h3 className="mb-4">For Students</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Create Profile</li>
                <li>Find Universities</li>
                <li>Track Applications</li>
                <li>FAQs</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">For Universities</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Register Institution</li>
                <li>Manage Applications</li>
                <li>Configure Forms</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>support@uaams.pk</li>
                <li>+92 300 1234567</li>
                <li>Islamabad, Pakistan</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            © 2025 UAAMS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>;
}
function FeatureCard({ icon, title, description }) {
  return <div className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>;
}
function StatCard({ number, label }) {
  return <div>
      <div className="text-4xl mb-2">{number}</div>
      <div className="text-emerald-100">{label}</div>
    </div>;
}
function StepCard({ number, title, description }) {
  return <div className="text-center">
      <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
        {number}
      </div>
      <h3 className="text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>;
}
export {
  LandingPage
};
