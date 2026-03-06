import { useState } from "react";
import { Plus, Trash2, MoveUp, MoveDown, Save, Eye } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
function FormBuilder({ universityId, onSave, initialFields = [] }) {
  const [fields, setFields] = useState(initialFields.length > 0 ? initialFields : [
    { id: "1", label: "Full Name", type: "text", required: true, placeholder: "Enter your full name" },
    { id: "2", label: "Email Address", type: "email", required: true, placeholder: "your.email@example.com" },
    { id: "3", label: "Phone Number", type: "tel", required: true, placeholder: "+92-300-1234567" },
    { id: "4", label: "CNIC/B-Form Number", type: "text", required: true, placeholder: "12345-1234567-1" },
    { id: "5", label: "Father Name", type: "text", required: true, placeholder: "Enter father's name" },
    { id: "6", label: "Date of Birth", type: "date", required: true },
    { id: "7", label: "Matric Marks", type: "number", required: true, placeholder: "Total marks obtained" },
    { id: "8", label: "FSc/A-Level Marks", type: "number", required: true, placeholder: "Total marks obtained" }
  ]);
  const [editingField, setEditingField] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fieldTypes = [
    { value: "text", label: "Text Input" },
    { value: "email", label: "Email" },
    { value: "number", label: "Number" },
    { value: "tel", label: "Phone" },
    { value: "textarea", label: "Text Area" },
    { value: "select", label: "Dropdown" },
    { value: "date", label: "Date" },
    { value: "file", label: "File Upload" }
  ];
  const addField = () => {
    const newField = {
      id: Date.now().toString(),
      label: "New Field",
      type: "text",
      required: false,
      placeholder: ""
    };
    setFields([...fields, newField]);
    setEditingField(newField);
  };
  const updateField = (id, updates) => {
    setFields(fields.map(
      (field) => field.id === id ? { ...field, ...updates } : field
    ));
    if (editingField?.id === id) {
      setEditingField({ ...editingField, ...updates });
    }
  };
  const deleteField = (id) => {
    if (confirm("Are you sure you want to delete this field?")) {
      setFields(fields.filter((field) => field.id !== id));
      if (editingField?.id === id) {
        setEditingField(null);
      }
    }
  };
  const moveField = (index, direction) => {
    const newFields = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setFields(newFields);
  };
  const handleSave = () => {
    if (fields.length === 0) {
      alert("Please add at least one field to the form.");
      return;
    }
    onSave(fields);
    alert("Application form saved successfully!");
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900 mb-1">Application Form Builder</h2>
          <p className="text-slate-600 text-sm">
            Configure the application form that students will fill when applying to your university
          </p>
        </div>
        <div className="flex gap-2">
          <Button
    variant="outline"
    onClick={() => setShowPreview(!showPreview)}
    className="gap-2"
  >
            <Eye className="w-4 h-4" />
            {showPreview ? "Edit Mode" : "Preview"}
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Form
          </Button>
        </div>
      </div>

      {showPreview ? <Card className="bg-white border border-slate-200 p-6">
          <h3 className="text-slate-900 mb-4">Form Preview</h3>
          <div className="space-y-4">
            {fields.map((field) => <div key={field.id}>
                <label className="block text-slate-700 mb-2 text-sm">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {field.type === "textarea" ? <textarea
    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
    placeholder={field.placeholder}
    rows={4}
    disabled
  /> : field.type === "select" ? <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" disabled>
                    <option>Select an option</option>
                    {field.options?.map((opt, idx) => <option key={idx}>{opt}</option>)}
                  </select> : <input
    type={field.type}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
    placeholder={field.placeholder}
    disabled
  />}
              </div>)}
          </div>
        </Card> : <div className="grid lg:grid-cols-2 gap-6">
          {
    /* Fields List */
  }
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900">Form Fields</h3>
              <Button onClick={addField} size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Field
              </Button>
            </div>

            {fields.map((field, index) => <Card
    key={field.id}
    className={`bg-white border p-4 cursor-pointer transition-all ${editingField?.id === field.id ? "border-blue-500 shadow-md" : "border-slate-200 hover:border-slate-300"}`}
    onClick={() => setEditingField(field)}
  >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-900 font-medium">{field.label}</span>
                      {field.required && <Badge className="bg-red-100 text-red-700 text-xs">Required</Badge>}
                    </div>
                    <div className="text-sm text-slate-500">
                      Type: {fieldTypes.find((t) => t.value === field.type)?.label}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
    onClick={(e) => {
      e.stopPropagation();
      moveField(index, "up");
    }}
    disabled={index === 0}
    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
  >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
    onClick={(e) => {
      e.stopPropagation();
      moveField(index, "down");
    }}
    disabled={index === fields.length - 1}
    className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"
  >
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button
    onClick={(e) => {
      e.stopPropagation();
      deleteField(field.id);
    }}
    className="p-1 text-red-400 hover:text-red-600"
  >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>)}

            {fields.length === 0 && <Card className="bg-slate-50 border-slate-200 p-8 text-center">
                <p className="text-slate-500 mb-4">No fields added yet</p>
                <Button onClick={addField} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Your First Field
                </Button>
              </Card>}
          </div>

          {
    /* Field Editor */
  }
          <div>
            <h3 className="text-slate-900 mb-4">Field Settings</h3>
            {editingField ? <Card className="bg-white border border-slate-200 p-6 space-y-4">
                <div>
                  <label className="block text-slate-700 mb-2 text-sm">Field Label</label>
                  <Input
    value={editingField.label}
    onChange={(e) => updateField(editingField.id, { label: e.target.value })}
    placeholder="e.g., Full Name"
  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-2 text-sm">Field Type</label>
                  <select
    value={editingField.type}
    onChange={(e) => updateField(editingField.id, { type: e.target.value })}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
  >
                    {fieldTypes.map((type) => <option key={type.value} value={type.value}>
                        {type.label}
                      </option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-2 text-sm">Placeholder Text</label>
                  <Input
    value={editingField.placeholder || ""}
    onChange={(e) => updateField(editingField.id, { placeholder: e.target.value })}
    placeholder="Optional placeholder text"
  />
                </div>

                {editingField.type === "select" && <div>
                    <label className="block text-slate-700 mb-2 text-sm">Options (comma-separated)</label>
                    <Input
    value={editingField.options?.join(", ") || ""}
    onChange={(e) => updateField(editingField.id, {
      options: e.target.value.split(",").map((o) => o.trim()).filter(Boolean)
    })}
    placeholder="Option 1, Option 2, Option 3"
  />
                  </div>}

                <div className="flex items-center gap-2">
                  <input
    type="checkbox"
    id="required"
    checked={editingField.required}
    onChange={(e) => updateField(editingField.id, { required: e.target.checked })}
    className="w-4 h-4 text-blue-600 rounded"
  />
                  <label htmlFor="required" className="text-slate-700 text-sm">
                    Required field
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <Button
    variant="outline"
    onClick={() => deleteField(editingField.id)}
    className="w-full gap-2 text-red-600 hover:text-red-700"
  >
                    <Trash2 className="w-4 h-4" />
                    Delete Field
                  </Button>
                </div>
              </Card> : <Card className="bg-slate-50 border-slate-200 p-8 text-center">
                <p className="text-slate-500">
                  Select a field to edit its settings
                </p>
              </Card>}
          </div>
        </div>}
    </div>;
}
export {
  FormBuilder
};
