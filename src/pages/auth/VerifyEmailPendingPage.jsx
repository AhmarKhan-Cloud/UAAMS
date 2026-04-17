import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { roleLabelMap } from "../../utils/rolePaths";

const validRoles = new Set(["student", "university", "blogger", "admin"]);

export const VerifyEmailPendingPage = () => {
  const [searchParams] = useSearchParams();
  const email = useMemo(() => String(searchParams.get("email") || "").trim(), [searchParams]);
  const roleParam = useMemo(() => String(searchParams.get("role") || "").trim(), [searchParams]);
  const role = validRoles.has(roleParam) ? roleParam : "student";

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl text-slate-900">Verify Your Email</h1>
        <p className="mt-2 text-sm text-slate-600">
          We sent a verification link to:
        </p>
        <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-900">
          {email || "your registered email"}
        </p>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Click the verification link in your email to complete registration.
        </div>

        <p className="mt-4 text-sm text-slate-600">
          After verification, you can login to your {roleLabelMap[role].toLowerCase()} portal.
        </p>

        <div className="mt-6">
          <Link
            to={`/login/${role}`}
            className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Back to Login
          </Link>
        </div>
      </section>
    </div>
  );
};
