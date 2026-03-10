import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { resolveRolePath, roleLabelMap } from "../../utils/rolePaths";

const roleOptions = ["student", "university", "blogger", "admin"];

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role");
  const location = useLocation();
  const navigate = useNavigate();
  const { login, currentUser, demoCredentials } = useAuth();

  const [role, setRole] = useState(
    roleOptions.includes(initialRole) ? initialRole : "student",
  );
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const fromLocation = useMemo(
    () => location.state?.from?.pathname,
    [location.state],
  );

  useEffect(() => {
    if (currentUser?.role) {
      navigate(resolveRolePath(currentUser.role), { replace: true });
    }
  }, [currentUser, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = login({ identifier, password, role });

    if (!result.ok) {
      setMessage(result.message);
      return;
    }

    setMessage("");
    const destination = fromLocation || resolveRolePath(result.user.role);
    navigate(destination, { replace: true });
  };

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl text-slate-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Select your role and continue to your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-slate-700">Role</label>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {roleOptions.map((item) => (
                  <option key={item} value={item}>
                    {roleLabelMap[item]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">
                {role === "blogger" ? "Email or Username" : "Email"}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder={role === "blogger" ? "campus_writer" : "you@example.com"}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {message ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
            >
              Login
            </button>
          </form>

          <p className="mt-5 text-sm text-slate-600">
            Don&apos;t have an account? {" "}
            <Link to="/register" className="text-emerald-700 hover:text-emerald-800">
              Create one
            </Link>
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl text-slate-900">Demo credentials</h2>
          <p className="mt-2 text-sm text-slate-600">
            Use these credentials during FYP presentation.
          </p>

          <div className="mt-4 space-y-3">
            {demoCredentials.map((demo) => (
              <div
                key={`${demo.role}-${demo.identifier}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="text-sm text-slate-900">{roleLabelMap[demo.role]}</div>
                <div className="mt-1 text-xs text-slate-600">ID: {demo.identifier}</div>
                <div className="text-xs text-slate-600">Password: {demo.password}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};