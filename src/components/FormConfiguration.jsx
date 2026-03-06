import { useState } from "react";
import { Plus, Trash2, GripVertical, Save, X } from "lucide-react";
const defaultFields = [
  { id: "1", label: "Full Name", type: "text", required: true },
  { id: "2", label: "Email Address", type: "email", required: true },
  { id: "3", label: "CNIC / B-Form", type: "text", required: true },
  { id: "4", label: "Date of Birth", type: "date", required: true },
  { id: "5", label: "Matric Marks", type: "number", required: true },
  { id: "6", label: "Intermediate Marks", type: "number", required: true }
];
const defaultPrograms = [
  {
    id: "1",
    name: "Computer Science",
    seats: 100,
    feeRange: "PKR 400,000 - 500,000",
    requiredAggregate: 75
  },
  {
    id: "2",
    name: "Electrical Engineering",
    seats: 80,
    feeRange: "PKR 350,000 - 450,000",
    requiredAggregate: 72
  },
  {
    id: "3",
    name: "Software Engineering",
    seats: 60,
    feeRange: "PKR 400,000 - 500,000",
    requiredAggregate: 73
  }
];
function FormConfiguration() {
  const [fields, setFields] = useState(defaultFields);
  const [showAddField, setShowAddField] = useState(false);
  const [programs, setPrograms] = useState(defaultPrograms);
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const handleAddField = (field) => {
    setFields([...fields, { ...field, id: Date.now().toString() }]);
    setShowAddField(false);
  };
  const handleDeleteField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
  };
  const handleToggleRequired = (id) => {
    setFields(fields.map(
      (f) => f.id === id ? { ...f, required: !f.required } : f
    ));
  };
  const handleAddProgram = (program) => {
    setPrograms([...programs, { ...program, id: Date.now().toString() }]);
    setShowAddProgram(false);
  };
  const handleEditProgram = (program) => {
    setPrograms(programs.map((p) => p.id === program.id ? program : p));
    setEditingProgram(null);
  };
  const handleDeleteProgram = (id) => {
    if (confirm("Are you sure you want to delete this program?")) {
      setPrograms(programs.filter((p) => p.id !== id));
    }
  };
  const handleSave = () => {
    alert("Form configuration saved successfully!");
  };
  return <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-slate-900 mb-2">Form Configuration</h1>
          <p className="text-slate-600">Customize your admission form fields</p>
        </div>
        <button
    onClick={handleSave}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
          <Save className="w-4 h-4" />
          Save Configuration
        </button>
      </div>

      {
    /* Form Preview */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Form Fields</h3>
        <div className="space-y-3">
          {fields.map((field, index) => <FormFieldItem
    key={field.id}
    field={field}
    index={index}
    onDelete={handleDeleteField}
    onToggleRequired={handleToggleRequired}
  />)}
        </div>
        <button
    onClick={() => setShowAddField(true)}
    className="mt-4 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center"
  >
          <Plus className="w-5 h-5" />
          Add Custom Field
        </button>
      </div>

      {
    /* Eligibility Criteria */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Eligibility Criteria</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 mb-2 text-sm">
                Minimum Aggregate Required
              </label>
              <input
    type="number"
    placeholder="e.g., 70"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">
                Maximum Age Limit
              </label>
              <input
    type="number"
    placeholder="e.g., 25"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">
                Minimum Matric Percentage
              </label>
              <input
    type="number"
    placeholder="e.g., 60"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
            <div>
              <label className="block text-slate-700 mb-2 text-sm">
                Minimum Inter Percentage
              </label>
              <input
    type="number"
    placeholder="e.g., 60"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
            </div>
          </div>
        </div>
      </div>

      {
    /* Programs Configuration */
  }
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Available Programs</h3>
        <div className="space-y-3">
          {programs.map((program) => <ProgramItem
    key={program.id}
    program={program}
    onEdit={setEditingProgram}
    onDelete={handleDeleteProgram}
  />)}
        </div>
        <button
    onClick={() => setShowAddProgram(true)}
    className="mt-4 flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
  >
          <Plus className="w-4 h-4" />
          Add Program
        </button>
      </div>

      {
    /* Add Field Modal */
  }
      {showAddField && <AddFieldModal
    onAdd={handleAddField}
    onClose={() => setShowAddField(false)}
  />}

      {
    /* Add Program Modal */
  }
      {showAddProgram && <ProgramModal
    onSave={handleAddProgram}
    onClose={() => setShowAddProgram(false)}
  />}

      {
    /* Edit Program Modal */
  }
      {editingProgram && <ProgramModal
    program={editingProgram}
    onSave={handleEditProgram}
    onClose={() => setEditingProgram(null)}
  />}
    </div>;
}
function FormFieldItem({
  field,
  index,
  onDelete,
  onToggleRequired
}) {
  return <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
      <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-slate-900">{field.label}</span>
          {field.required && <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
              Required
            </span>}
        </div>
        <div className="text-slate-600 text-sm">Type: {field.type}</div>
      </div>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
          <input
    type="checkbox"
    checked={field.required}
    onChange={() => onToggleRequired(field.id)}
    className="rounded border-slate-300"
  />
          Required
        </label>
        <button
    onClick={() => onDelete(field.id)}
    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
  >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>;
}
function ProgramItem({
  program,
  onEdit,
  onDelete
}) {
  return <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
      <div>
        <div className="text-slate-900 mb-1">{program.name}</div>
        <div className="text-slate-600 text-sm">
          {program.seats} seats • {program.feeRange} • Min Aggregate: {program.requiredAggregate}%
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
    onClick={() => onEdit(program)}
    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm"
  >
          Edit
        </button>
        <button
    onClick={() => onDelete(program.id)}
    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm"
  >
          Remove
        </button>
      </div>
    </div>;
}
function AddFieldModal({
  onAdd,
  onClose
}) {
  const [newField, setNewField] = useState({
    id: "",
    label: "",
    type: "text",
    required: false
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newField.label) {
      onAdd(newField);
    }
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-slate-900 mb-4">Add Custom Field</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Field Label</label>
            <input
    type="text"
    value={newField.label}
    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
    placeholder="e.g., Phone Number"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Field Type</label>
            <select
    value={newField.type}
    onChange={(e) => setNewField({ ...newField, type: e.target.value })}
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="select">Dropdown</option>
              <option value="file">File Upload</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input
    type="checkbox"
    checked={newField.required}
    onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
    className="rounded border-slate-300"
  />
              <span className="text-slate-700 text-sm">Required Field</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
    type="submit"
    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
              Add Field
            </button>
            <button
    type="button"
    onClick={onClose}
    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
  >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>;
}
function ProgramModal({
  program,
  onSave,
  onClose
}) {
  const [formData, setFormData] = useState(
    program || {
      id: "",
      name: "",
      seats: 0,
      feeRange: "",
      requiredAggregate: 0
    }
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-slate-900">{program ? "Edit Program" : "Add Program"}</h2>
          <button
    onClick={onClose}
    className="text-slate-400 hover:text-slate-600"
  >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Program Name</label>
            <input
    type="text"
    value={formData.name}
    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    placeholder="e.g., Computer Science"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Available Seats</label>
            <input
    type="number"
    value={formData.seats}
    onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 0 })}
    placeholder="e.g., 100"
    min="0"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Fee Range</label>
            <input
    type="text"
    value={formData.feeRange}
    onChange={(e) => setFormData({ ...formData, feeRange: e.target.value })}
    placeholder="e.g., PKR 400,000 - 500,000"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Required Aggregate (%)</label>
            <input
    type="number"
    value={formData.requiredAggregate}
    onChange={(e) => setFormData({ ...formData, requiredAggregate: parseFloat(e.target.value) || 0 })}
    placeholder="e.g., 75"
    min="0"
    max="100"
    step="0.01"
    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  />
          </div>
          <div className="flex gap-3 pt-4">
            <button
    type="submit"
    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
  >
              {program ? "Update Program" : "Add Program"}
            </button>
            <button
    type="button"
    onClick={onClose}
    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
  >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>;
}
export {
  FormConfiguration
};
