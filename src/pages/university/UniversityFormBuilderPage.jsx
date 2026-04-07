import { useEffect, useState } from "react";
import { FormBuilder } from "../../components/university/FormBuilder";
import { DashboardPageShell } from "../shared/DashboardPageShell";
import { api } from "../../lib/apiClient";

const formatDateTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
};

export const UniversityFormBuilderPage = () => {
  const [savedAt, setSavedAt] = useState("");
  const [fields, setFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadForm = async () => {
      setIsLoading(true);
      setError("");
      try {
        const response = await api.get("/universities/me/form");
        if (!isMounted) return;
        setFields(response?.data?.fields || []);
        setSavedAt(formatDateTime(response?.data?.updatedAt));
      } catch (loadError) {
        if (!isMounted) return;
        setError(loadError?.message || "Unable to load form configuration.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadForm();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (nextFields) => {
    setError("");
    try {
      const response = await api.put("/universities/me/form", { fields: nextFields });
      const form = response?.data?.form;
      setFields(form?.fields || nextFields);
      setSavedAt(formatDateTime(form?.updatedAt || new Date().toISOString()));
    } catch (saveError) {
      setError(saveError?.message || "Unable to save form configuration.");
      throw saveError;
    }
  };

  if (isLoading) {
    return (
      <DashboardPageShell
        title="Dynamic Form Builder"
        subtitle="Design custom admission forms and save each revision instantly."
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Loading saved form configuration...
        </div>
      </DashboardPageShell>
    );
  }

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
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}
      <FormBuilder
        onSave={handleSave}
        initialFields={fields}
      />
    </DashboardPageShell>
  );
};
