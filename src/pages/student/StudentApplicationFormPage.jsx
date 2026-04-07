import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DashboardPageShell } from "../shared/DashboardPageShell";
import { api } from "../../lib/apiClient";
import { readFileAsDataUrl } from "../../lib/fileDataUrl";
import {
  defaultApplicationFields,
  getApplicationFieldsForUniversity,
  getUniversityById,
} from "../../data/universityRecommendationsData";

const getFieldValue = ({
  field,
  value,
  onChange,
  onFileChange,
  error,
  fileHint,
  onClearFile,
}) => {
  const commonClass = `w-full px-3 py-2 border rounded-lg text-sm ${
    error ? "border-red-500" : "border-slate-300"
  }`;

  if (field.type === "textarea") {
    return (
      <textarea
        value={value || ""}
        onChange={(event) => onChange(field.id, event.target.value)}
        placeholder={field.placeholder}
        className={commonClass}
        rows={4}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={value || ""}
        onChange={(event) => onChange(field.id, event.target.value)}
        className={commonClass}
      >
        <option value="">Select an option</option>
        {field.options?.map((option, index) => (
          <option key={`${field.id}-${index}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "file") {
    return (
      <div className="space-y-2">
        {value ? (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
            <span>Attached: {fileHint || "Document uploaded"}</span>
            <button
              type="button"
              onClick={() => onClearFile(field.id)}
              className="rounded border border-emerald-300 px-2 py-0.5 text-emerald-700 hover:bg-emerald-100"
            >
              Remove
            </button>
          </div>
        ) : null}
        <input
          type="file"
          onChange={(event) => onFileChange(field.id, event.target.files?.[0])}
          className={commonClass}
        />
      </div>
    );
  }

  return (
    <input
      type={field.type}
      value={value || ""}
      onChange={(event) => onChange(field.id, event.target.value)}
      placeholder={field.placeholder}
      className={commonClass}
    />
  );
};

const hasTextValue = (value) => String(value ?? "").trim().length > 0;

const pickFirstValue = (...values) => {
  for (const value of values) {
    if (hasTextValue(value)) {
      return String(value);
    }
  }
  return "";
};

const resolveProfileValueForField = ({ field, profile, currentUser }) => {
  const byFieldId = {
    "1": pickFirstValue(profile?.fullName, currentUser?.name),
    "2": pickFirstValue(profile?.email, currentUser?.email),
    "3": pickFirstValue(profile?.phone),
    "4": pickFirstValue(profile?.cnic),
    "7": pickFirstValue(profile?.matricObtainedMarks),
    "8": pickFirstValue(profile?.interObtainedMarks),
    "9": pickFirstValue(profile?.profilePicture),
    "10": pickFirstValue(profile?.domicileDocument),
    "11": pickFirstValue(profile?.matricResultDocument),
    "12": pickFirstValue(profile?.interResultDocument),
  };

  if (Object.prototype.hasOwnProperty.call(byFieldId, field.id)) {
    return byFieldId[field.id];
  }

  const label = String(field?.label || "").toLowerCase();

  if (label.includes("full name")) return pickFirstValue(profile?.fullName, currentUser?.name);
  if (label.includes("email")) return pickFirstValue(profile?.email, currentUser?.email);
  if (label.includes("father")) return pickFirstValue(profile?.fatherName);
  if (label.includes("cnic") || label.includes("b-form")) return pickFirstValue(profile?.cnic);
  if (label.includes("phone")) return pickFirstValue(profile?.phone);
  if (label.includes("date of birth") || label.includes("dob")) return pickFirstValue(profile?.dateOfBirth);
  if (label.includes("address")) return pickFirstValue(profile?.address);
  if (label === "city" || label.includes("city")) return pickFirstValue(profile?.city);
  if (label.includes("province")) return pickFirstValue(profile?.province);
  if (label.includes("postal")) return pickFirstValue(profile?.postalCode);
  if ((label.includes("profile") && label.includes("picture")) || label.includes("photo")) {
    return pickFirstValue(profile?.profilePicture);
  }
  if (label.includes("domicile")) return pickFirstValue(profile?.domicileDocument);
  if (label.includes("matric") && label.includes("result")) {
    return pickFirstValue(profile?.matricResultDocument);
  }
  if ((label.includes("inter") || label.includes("fsc") || label.includes("a-level")) && label.includes("result")) {
    return pickFirstValue(profile?.interResultDocument);
  }
  if (label.includes("matric") && label.includes("marks")) {
    return pickFirstValue(profile?.matricObtainedMarks);
  }
  if ((label.includes("inter") || label.includes("fsc") || label.includes("a-level")) && label.includes("marks")) {
    return pickFirstValue(profile?.interObtainedMarks);
  }

  return "";
};

const resolveProfileFileNameForField = ({ field, profile }) => {
  const byFieldId = {
    "9": pickFirstValue(profile?.profilePictureFileName, "Profile Picture"),
    "10": pickFirstValue(profile?.domicileFileName, "Domicile Certificate"),
    "11": pickFirstValue(profile?.matricResultFileName, "Matric Result"),
    "12": pickFirstValue(profile?.interResultFileName, "Inter Result"),
  };

  if (Object.prototype.hasOwnProperty.call(byFieldId, field.id)) {
    return byFieldId[field.id];
  }

  const label = String(field?.label || "").toLowerCase();
  if ((label.includes("profile") && label.includes("picture")) || label.includes("photo")) {
    return pickFirstValue(profile?.profilePictureFileName, "Profile Picture");
  }
  if (label.includes("domicile")) {
    return pickFirstValue(profile?.domicileFileName, "Domicile Certificate");
  }
  if (label.includes("matric") && label.includes("result")) {
    return pickFirstValue(profile?.matricResultFileName, "Matric Result");
  }
  if ((label.includes("inter") || label.includes("fsc") || label.includes("a-level")) && label.includes("result")) {
    return pickFirstValue(profile?.interResultFileName, "Inter Result");
  }
  return "";
};

const buildAutoFilledFormData = ({ fields, profile, currentUser }) => {
  const autoFill = {};
  const autoFillFileHints = {};

  fields.forEach((field) => {
    const value = resolveProfileValueForField({ field, profile, currentUser });
    if (hasTextValue(value)) {
      autoFill[field.id] = String(value);
      if (field.type === "file") {
        const fileName = resolveProfileFileNameForField({ field, profile });
        autoFillFileHints[field.id] = fileName || "Document from profile";
      }
    }
  });

  return {
    values: autoFill,
    fileHints: autoFillFileHints,
  };
};

const requiredDocumentFields = [
  {
    id: "uaams-doc-profile-picture",
    label: "Profile Picture",
    type: "file",
    required: true,
    placeholder: "",
    options: [],
    keywords: ["profile", "picture"],
  },
  {
    id: "uaams-doc-domicile",
    label: "Domicile Certificate",
    type: "file",
    required: true,
    placeholder: "",
    options: [],
    keywords: ["domicile"],
  },
  {
    id: "uaams-doc-matric-result",
    label: "Matric Result",
    type: "file",
    required: true,
    placeholder: "",
    options: [],
    keywords: ["matric", "result"],
  },
  {
    id: "uaams-doc-inter-result",
    label: "Inter Result",
    type: "file",
    required: true,
    placeholder: "",
    options: [],
    keywords: ["inter", "result"],
  },
];

const ensureRequiredDocumentFields = (fields = []) => {
  const next = [...fields];

  requiredDocumentFields.forEach((requiredField) => {
    const alreadyExists = next.some((field) => {
      const label = String(field?.label || "").toLowerCase();
      return requiredField.keywords.every((keyword) => label.includes(keyword));
    });

    if (!alreadyExists) {
      const { keywords, ...fieldWithoutKeywords } = requiredField;
      next.push(fieldWithoutKeywords);
    }
  });

  return next;
};

export const StudentApplicationFormPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { universityId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedProgram = searchParams.get("program") || "";

  const [university, setUniversity] = useState(null);
  const [formFields, setFormFields] = useState(defaultApplicationFields);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    "1": currentUser?.name || "",
    "2": currentUser?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [autoFillMessage, setAutoFillMessage] = useState("");
  const [fileHints, setFileHints] = useState({});

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const [universityResult, fieldsResult, profileResponse] = await Promise.all([
          getUniversityById(universityId),
          getApplicationFieldsForUniversity(universityId),
          api.get("/students/me/profile"),
        ]);

        if (!isMounted) return;
        const effectiveFields =
          Array.isArray(fieldsResult) && fieldsResult.length > 0
            ? fieldsResult
            : defaultApplicationFields;
        const fieldsWithRequiredDocs = ensureRequiredDocumentFields(effectiveFields);
        const profile = profileResponse?.data?.profile || {};
        const autoFillData = buildAutoFilledFormData({
          fields: fieldsWithRequiredDocs,
          profile,
          currentUser,
        });

        setUniversity(universityResult);
        setFormFields(fieldsWithRequiredDocs);
        setFormData((previous) => ({
          ...previous,
          ...autoFillData.values,
        }));
        setFileHints((previous) => ({
          ...previous,
          ...autoFillData.fileHints,
        }));
        setAutoFillMessage(
          Object.keys(autoFillData.values).length > 0
            ? "Form was auto-filled from your student profile. You can edit any field before submission."
            : "",
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || "Unable to load form details.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [universityId, currentUser]);

  const resolvedProgram = useMemo(
    () => selectedProgram || university?.programs?.[0] || "Program",
    [selectedProgram, university],
  );

  const handleChange = (fieldId, value) => {
    setFormData((previous) => ({ ...previous, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((previous) => ({ ...previous, [fieldId]: "" }));
    }
    if (submitError) {
      setSubmitError("");
    }
  };

  const handleFileChange = async (fieldId, file) => {
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);
      setFormData((previous) => ({ ...previous, [fieldId]: dataUrl }));
      setFileHints((previous) => ({ ...previous, [fieldId]: file.name }));
      if (errors[fieldId]) {
        setErrors((previous) => ({ ...previous, [fieldId]: "" }));
      }
    } catch (error) {
      setSubmitError(error?.message || "Unable to read selected file.");
    }
  };

  const handleClearFile = (fieldId) => {
    setFormData((previous) => ({ ...previous, [fieldId]: "" }));
    setFileHints((previous) => ({ ...previous, [fieldId]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    const nextErrors = {};

    formFields.forEach((field) => {
      if (field.required && !String(formData[field.id] || "").trim()) {
        nextErrors[field.id] = `${field.label} is required.`;
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/applications", {
        universityId: university?.id || universityId,
        program: resolvedProgram,
        formData,
      });

      const applicationId = response?.data?.application?._id;
      if (!applicationId) {
        setSubmitError("Application draft was created but ID was not returned.");
        return;
      }

      navigate(`/student/apply/${universityId}/payment/${applicationId}`);
    } catch (submissionError) {
      setSubmitError(submissionError?.message || "Unable to create application draft.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardPageShell
        title="Application Form"
        subtitle="Loading university form..."
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Fetching form details...
        </div>
      </DashboardPageShell>
    );
  }

  if (error || !university) {
    return (
      <DashboardPageShell
        title="Application Form"
        subtitle={error || "Selected university could not be found."}
        actions={
          <button
            onClick={() => navigate("/student/recommendations")}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Back to Recommendations
          </button>
        }
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Please return to recommendations and choose a valid university/program.
        </div>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell
      title="Application Form"
      subtitle={`${university.name} - ${resolvedProgram || "Program not selected"}`}
      actions={
        <button
          onClick={() => navigate("/student/recommendations")}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Application Fee: PKR {Number(university.applicationFee || 0).toLocaleString()} (to be paid on
          next page)
        </div>
        {autoFillMessage ? (
          <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {autoFillMessage}
          </div>
        ) : null}

        {formFields.map((field) => (
          <div key={field.id}>
            <label className="mb-2 block text-sm text-slate-700">
              {field.label}
              {field.required ? <span className="ml-1 text-red-500">*</span> : null}
            </label>
            {getFieldValue({
              field,
              value: formData[field.id],
              onChange: handleChange,
              onFileChange: handleFileChange,
              error: errors[field.id],
              fileHint: fileHints[field.id],
              onClearFile: handleClearFile,
            })}
            {errors[field.id] ? (
              <p className="mt-1 text-xs text-red-600">{errors[field.id]}</p>
            ) : null}
          </div>
        ))}

        {submitError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
        ) : null}

        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={() => navigate("/student/recommendations")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
          >
            {isSubmitting ? "Creating Draft..." : "Continue to Payment"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </DashboardPageShell>
  );
};
