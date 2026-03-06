import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
function ApplicationFormModal({
  universityName,
  programName,
  formFields,
  onClose,
  onSubmit
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const handleChange = (fieldId, value) => {
    setFormData({ ...formData, [fieldId]: value });
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: "" });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    formFields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {
    /* Header */
  }
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-slate-900 mb-1">Application Form</h2>
              <p className="text-slate-600 text-sm">
                {universityName} - {programName}
              </p>
            </div>
            <button
    onClick={onClose}
    className="text-slate-400 hover:text-slate-600 transition-colors"
  >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {
    /* Form Content */
  }
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {formFields.map((field) => <div key={field.id}>
                <label className="block text-slate-700 mb-2 text-sm">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {field.type === "textarea" ? <textarea
    value={formData[field.id] || ""}
    onChange={(e) => handleChange(field.id, e.target.value)}
    placeholder={field.placeholder}
    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors[field.id] ? "border-red-500" : "border-slate-300"}`}
    rows={4}
  /> : field.type === "select" ? <select
    value={formData[field.id] || ""}
    onChange={(e) => handleChange(field.id, e.target.value)}
    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors[field.id] ? "border-red-500" : "border-slate-300"}`}
  >
                    <option value="">Select an option</option>
                    {field.options?.map((option, idx) => <option key={idx} value={option}>
                        {option}
                      </option>)}
                  </select> : field.type === "file" ? <input
    type="file"
    onChange={(e) => handleChange(field.id, e.target.files?.[0]?.name || "")}
    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors[field.id] ? "border-red-500" : "border-slate-300"}`}
  /> : <input
    type={field.type}
    value={formData[field.id] || ""}
    onChange={(e) => handleChange(field.id, e.target.value)}
    placeholder={field.placeholder}
    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors[field.id] ? "border-red-500" : "border-slate-300"}`}
  />}
                
                {errors[field.id] && <p className="text-red-500 text-xs mt-1">{errors[field.id]}</p>}
              </div>)}
          </div>

          {
    /* Footer */
  }
          <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
            <Button
    type="button"
    variant="outline"
    onClick={onClose}
    className="flex-1"
  >
              Cancel
            </Button>
            <Button
    type="submit"
    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
  >
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>;
}
export {
  ApplicationFormModal
};
