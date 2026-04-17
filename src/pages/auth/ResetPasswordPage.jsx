import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PasswordField } from "../../components/shared/PasswordField";
import { useAuth } from "../../context/AuthContext";

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { resetPasswordWithOtp } = useAuth();
  const [searchParams] = useSearchParams();

  const email = useMemo(() => String(searchParams.get("email") || "").trim(), [searchParams]);
  const otp = useMemo(() => String(searchParams.get("otp") || "").trim(), [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    const result = await resetPasswordWithOtp({
      email,
      otp,
      newPassword,
      confirmPassword,
    });

    if (!result.ok) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    setMessage(result.message);
    setTimeout(() => {
      navigate("/login/student", { replace: true });
    }, 1000);
    setIsSubmitting(false);
  };

  if (!email || !otp) {
    return (
      <div className="mx-auto flex min-h-[80vh] w-full max-w-xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-red-700">Missing reset context. Please verify OTP first.</p>
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
        <h1 className="text-2xl text-slate-900">Set New Password</h1>
        <p className="mt-2 text-sm text-slate-600">Account: {email}</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-700">New Password</label>
            <PasswordField
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter new password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-700">Confirm New Password</label>
            <PasswordField
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter new password"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
              autoComplete="new-password"
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
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
};
