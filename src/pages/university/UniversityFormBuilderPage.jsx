import { useState } from "react";
import { FormBuilder } from "../../components/university/FormBuilder";
import { DashboardPageShell } from "../shared/DashboardPageShell";
import { useAuth } from "../../context/AuthContext";

export const UniversityFormBuilderPage = () => {
  const { currentUser } = useAuth();
  const [savedAt, setSavedAt] = useState("");
  const [fields, setFields] = useState([]);

  const handleSave = (nextFields) => {
    setFields(nextFields);
    setSavedAt(new Date().toLocaleString());
  };

  return (
    <DashboardPageShell
      title="Dynamic Form Builder"
      subtitle="Design custom admission forms and save each revision instantly."
      actions={
        savedAt ? (
          <span className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Saved: {savedAt}
          </span>
        ) : null
      }
    >
      <FormBuilder
        universityId={currentUser?.id || "university-form-builder"}
        onSave={handleSave}
        initialFields={fields}
      />
    </DashboardPageShell>
  );
};