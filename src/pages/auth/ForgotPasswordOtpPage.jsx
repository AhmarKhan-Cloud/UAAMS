import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ForgotPasswordOtpPage = () => {
  const navigate = useNavigate();
  const { verifyPasswordResetOtp, requestPasswordResetOtp } = useAuth();
  const [searchParams] = useSearchParams();

  const email = useMemo(() => String(searchParams.get("email") || "").trim(), [searchParams]);

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    const result = await verifyPasswordResetOtp({ email, otp });
    if (!result.ok) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    navigate(
      `/forgot-password/reset?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp.trim())}`,
      { replace: true },
    );
    setIsSubmitting(false);
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    setIsResending(true);
    const result = await requestPasswordResetOtp(email);
    if (!result.ok) {
      setError(result.message);
      setIsResending(false);
      return;
    }
    setMessage(result.message);
    setIsResending(false);
  };

  if (!email) {
    return (
      <div className="mx-auto flex min-h-[80vh] w-full max-w-xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-red-700">Missing email. Please start from forgot password page.</p>
          <button
            type="button"
            onClick={() => navigate("/forgot-password", { replace: true })}
            className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
          >
            Go to Forgot Password
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl text-slate-900">Verify OTP</h1>
        <p className="mt-2 text-sm text-slate-600">OTP was sent to: {email}</p>

        <form onSubmit={handleVerify} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-700">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="6-digit OTP"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          {message ? (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={isResending}
          className="mt-3 text-sm text-emerald-700 hover:text-emerald-800 disabled:opacity-70"
        >
          {isResending ? "Resending OTP..." : "Resend OTP"}
        </button>
      </section>
    </div>
  );
};
