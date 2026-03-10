import { Save, Upload } from "lucide-react";
function UniversitySettings() {
  return <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">University Settings</h1>
        <p className="text-slate-600">Manage your university profile and preferences</p>
      </div>

      {
    /* Basic Information */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">University Name</label>
              <input
    type="text"
    defaultValue="National University of Sciences and Technology"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Short Name</label>
              <input
    type="text"
    defaultValue="NUST"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Email Address</label>
              <input
    type="email"
    defaultValue="admissions@nust.edu.pk"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Phone Number</label>
              <input
    type="tel"
    defaultValue="+92-51-9085-5555"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Address</label>
            <textarea
    defaultValue="H-12, Islamabad, Pakistan"
    rows={3}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Website URL</label>
            <input
    type="url"
    defaultValue="https://www.nust.edu.pk"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
          </div>
        </div>
      </div>

      {
    /* Logo Upload */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">University Logo</h3>
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
            <span className="text-slate-400 text-xs">Logo</span>
          </div>
          <div className="flex-1">
            <p className="text-slate-600 text-sm mb-3">
              Upload your university logo. Recommended size: 256x256px, max 2MB
            </p>
            <label className="cursor-pointer">
              <input type="file" className="hidden" accept="image/*" />
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                <Upload className="w-4 h-4" />
                Upload Logo
              </div>
            </label>
          </div>
        </div>
      </div>

      {
    /* Admission Settings */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Admission Settings</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Application Start Date</label>
              <input
    type="date"
    defaultValue="2025-05-01"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Application End Date</label>
              <input
    type="date"
    defaultValue="2025-06-30"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 mb-2 text-sm">Application Fee (PKR)</label>
            <input
    type="number"
    defaultValue="2000"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
    type="checkbox"
    defaultChecked
    className="rounded border-slate-300"
  />
              <span className="text-slate-700 text-sm">Accept applications through UAAMS</span>
            </label>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
    type="checkbox"
    defaultChecked
    className="rounded border-slate-300"
  />
              <span className="text-slate-700 text-sm">Allow automatic form filling from student profiles</span>
            </label>
          </div>
        </div>
      </div>

      {
    /* Notification Preferences */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          <div>
            <label className="flex items-center gap-2">
              <input
    type="checkbox"
    defaultChecked
    className="rounded border-slate-300"
  />
              <span className="text-slate-700 text-sm">Email notification for new applications</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
    type="checkbox"
    defaultChecked
    className="rounded border-slate-300"
  />
              <span className="text-slate-700 text-sm">Daily application summary</span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
    type="checkbox"
    className="rounded border-slate-300"
  />
              <span className="text-slate-700 text-sm">SMS notifications for urgent updates</span>
            </label>
          </div>
        </div>
      </div>

      {
    /* Contact Information */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Admission Office Contact</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Contact Person Name</label>
              <input
    type="text"
    placeholder="e.g., Dr. Ahmad Khan"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Designation</label>
              <input
    type="text"
    placeholder="e.g., Director Admissions"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Direct Email</label>
              <input
    type="email"
    placeholder="contact@university.edu.pk"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">Direct Phone</label>
              <input
    type="tel"
    placeholder="+92-XXX-XXXXXXX"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
          </div>
        </div>
      </div>

      {
    /* Save Button */
  }
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>
    </div>;
}
export {
  UniversitySettings
};
