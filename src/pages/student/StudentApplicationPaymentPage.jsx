import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CreditCard } from "lucide-react";
import { DashboardPageShell } from "../shared/DashboardPageShell";
import { api } from "../../lib/apiClient";

const resolveUniversityName = (university) => {
  if (!university) return "University";
  if (typeof university === "string") return "University";
  return university.name || "University";
};

export const StudentApplicationPaymentPage = () => {
  const navigate = useNavigate();
  const { universityId, applicationId } = useParams();

  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [paymentData, setPaymentData] = useState({
    method: "card",
    accountNumber: "",
    transactionReference: "",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadApplication = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const response = await api.get(`/applications/${applicationId}`);
        const nextApplication = response?.data?.application || null;
        if (!nextApplication) {
          throw new Error("Application not found.");
        }

        const applicationUniversityId =
          nextApplication?.university?._id ||
          nextApplication?.university?.id ||
          nextApplication?.university;

        if (
          applicationUniversityId &&
          String(applicationUniversityId) !== String(universityId)
        ) {
          throw new Error("Application does not match selected university.");
        }

        if (!isMounted) return;
        setApplication(nextApplication);
      } catch (error) {
        if (!isMounted) return;
        setLoadError(error?.message || "Unable to load application for payment.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadApplication();

    return () => {
      isMounted = false;
    };
  }, [applicationId, universityId]);

  const isAlreadyPaid = useMemo(
    () => application?.payment?.status === "paid",
    [application?.payment?.status],
  );

  const handleChange = (field, value) => {
    setPaymentData((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: "" }));
    }
    if (apiError) {
      setApiError("");
    }
  };

  const handlePayAndSubmit = async (event) => {
    event.preventDefault();
    setApiError("");

    const nextErrors = {};

    if (!paymentData.accountNumber.trim()) {
      nextErrors.accountNumber = "Account/Card number is required.";
    }

    if (!paymentData.transactionReference.trim()) {
      nextErrors.transactionReference = "Transaction reference is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!application?._id) {
      setApiError("Application draft not found.");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api.patch(`/applications/${application._id}/payment`, {
        method: paymentData.method,
        accountNumber: paymentData.accountNumber,
        transactionReference: paymentData.transactionReference,
      });

      setApplication((previous) => ({
        ...(previous || {}),
        ...(response?.data?.application || {}),
      }));

      navigate("/student/applications");
    } catch (error) {
      setApiError(error?.message || "Unable to submit application payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardPageShell title="Application Payment" subtitle="Loading application draft...">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Fetching payment details...
        </div>
      </DashboardPageShell>
    );
  }

  if (loadError || !application) {
    return (
      <DashboardPageShell
        title="Application Payment"
        subtitle={loadError || "Application could not be loaded."}
        actions={
          <button
            onClick={() => navigate("/student/applications")}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Back to Applications
          </button>
        }
      >
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Please create an application draft first, then continue to payment.
        </div>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell
      title="Application Payment"
      subtitle={`${resolveUniversityName(application.university)} - ${application.program || "Program"}`}
      actions={
        <button
          onClick={() =>
            navigate(
              `/student/apply/${universityId}?program=${encodeURIComponent(
                application.program || "",
              )}&draft=${encodeURIComponent(application._id || applicationId)}`,
            )
          }
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Form
        </button>
      }
    >
      <form
        onSubmit={handlePayAndSubmit}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <p className="font-medium">Application Fee</p>
          <p className="mt-1 text-lg">
            PKR {Number(application?.payment?.amount || 0).toLocaleString()}
          </p>
        </div>

        {isAlreadyPaid ? (
          <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700">
            Payment is already completed for this application.
          </p>
        ) : null}

        <div>
          <label className="mb-2 block text-sm text-slate-700">Payment Method</label>
          <select
            value={paymentData.method}
            onChange={(event) => handleChange("method", event.target.value)}
            disabled={isAlreadyPaid}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
          >
            <option value="card">Debit / Credit Card</option>
            <option value="bank">Bank Transfer</option>
            <option value="wallet">Mobile Wallet</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-700">Account / Card Number</label>
          <input
            type="text"
            value={paymentData.accountNumber}
            onChange={(event) => handleChange("accountNumber", event.target.value)}
            placeholder="Enter account or card number"
            disabled={isAlreadyPaid}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 ${
              errors.accountNumber ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.accountNumber ? (
            <p className="mt-1 text-xs text-red-600">{errors.accountNumber}</p>
          ) : null}
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-700">Transaction Reference</label>
          <input
            type="text"
            value={paymentData.transactionReference}
            onChange={(event) => handleChange("transactionReference", event.target.value)}
            placeholder="e.g. TXN-4582231"
            disabled={isAlreadyPaid}
            className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 ${
              errors.transactionReference ? "border-red-500" : "border-slate-300"
            }`}
          />
          {errors.transactionReference ? (
            <p className="mt-1 text-xs text-red-600">{errors.transactionReference}</p>
          ) : null}
        </div>

        {apiError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{apiError}</p>
        ) : null}

        <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Your draft will be marked submitted after successful payment.
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200 pt-4">
          <button
            type="submit"
            disabled={isProcessing || isAlreadyPaid}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <CreditCard className="h-4 w-4" />
            {isAlreadyPaid ? "Already Paid" : isProcessing ? "Processing..." : "Pay & Submit Application"}
          </button>
        </div>
      </form>
    </DashboardPageShell>
  );
};
