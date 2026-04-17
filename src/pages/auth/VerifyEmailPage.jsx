import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const validRoles = new Set(["student", "university", "blogger", "admin"]);

export const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationEmail } = useAuth();

  const token = useMemo(() => String(searchParams.get("token") || "").trim(), [searchParams]);
  const email = useMemo(() => String(searchParams.get("email") || "").trim(), [searchParams]);

  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const [loginRole, setLoginRole] = useState("student");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [resendEmailInput, setResendEmailInput] = useState(email);

  useEffect(() => {
    let isMounted = true;

    const verify = async () => {
      if (!token) {
        if (!isMounted) return;
        setIsVerifying(false);
        setIsVerified(false);
        setMessage("Verification token is missing.");
        return;
      }

      const result = await verifyEmail(token);
      if (!isMounted) return;

      if (!result.ok) {
        setIsVerifying(false);
        setIsVerified(false);
        setMessage(result.message || "Unable to verify email.");
        return;
      }

      const nextRole = String(result?.data?.role || "").trim();
      if (validRoles.has(nextRole)) {
        setLoginRole(nextRole);
      }
      setIsVerifying(false);
      setIsVerified(true);
      setMessage(result.message || "Email verified successfully.");
      setTimeout(() => {
        navigate(`/login/${validRoles.has(nextRole) ? nextRole : "student"}`, { replace: true });
      }, 1500);
    };

    verify();

    return () => {
      isMounted = false;
    };
  }, [navigate, token, verifyEmail]);

  const handleResend = async () => {
    const resendEmail = String(resendEmailInput || "").trim();
    if (!resendEmail) {
      setResendError("Please enter your registered email.");
      return;
    }
    setResendMessage("");
    setResendError("");
    setIsResending(true);

    const result = await resendVerificationEmail(resendEmail);
    if (!result.ok) {
      setResendError(result.message || "Unable to resend verification email.");
      setIsResending(false);
      return;
    }

    setResendMessage(result.message || "Verification link sent.");
    setIsResending(false);
  };

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl text-slate-900">Email Verification</h1>

        {isVerifying ? (
          <p className="mt-3 text-sm text-slate-600">Verifying your email link...</p>
        ) : null}

        {!isVerifying && isVerified ? (
          <>
            <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Registration successful. {message}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Redirecting to login page...
            </p>
          </>
        ) : null}

        {!isVerifying && !isVerified ? (
          <>
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {message || "Verification failed."}
            </p>
            <div className="mt-3 space-y-2">
              <input
                type="email"
                value={resendEmailInput}
                onChange={(event) => setResendEmailInput(event.target.value)}
                placeholder="Enter registered email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-70"
              >
                {isResending ? "Sending..." : "Resend Verification Link"}
              </button>
            </div>
            {resendMessage ? (
              <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {resendMessage}
              </p>
            ) : null}
            {resendError ? (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {resendError}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => navigate("/register/student", { replace: true })}
              className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
            >
              Register Again
            </button>
          </>
        ) : null}

        {!isVerifying && isVerified ? (
          <button
            type="button"
            onClick={() => navigate(`/login/${loginRole}`, { replace: true })}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Go to Login
          </button>
        ) : null}
      </section>
    </div>
  );
};
