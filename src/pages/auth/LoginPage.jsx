import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { PasswordField } from "../../components/shared/PasswordField";
import { useAuth } from "../../context/AuthContext";
import { resolveRolePath, roleLabelMap } from "../../utils/rolePaths";

const roleOptions = ["student", "university", "blogger", "admin"];
const selfRegisterRoles = new Set(["student", "university"]);

export const LoginPage = () => {
  const { role: roleParam } = useParams();
  const role = roleOptions.includes(roleParam) ? roleParam : "student";

  const location = useLocation();
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromLocation = useMemo(
    () => location.state?.from?.pathname,
    [location.state],
  );

  useEffect(() => {
    if (currentUser?.role) {
      navigate(resolveRolePath(currentUser.role), { replace: true });
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!roleOptions.includes(roleParam || "")) {
      navigate("/login/student", { replace: true });
    }
  }, [navigate, roleParam]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const result = await login({ identifier, password, role, rememberMe });

    if (!result.ok) {
      setMessage(result.message);
      setIsSubmitting(false);
      return;
    }

    setMessage("");
    const destination = fromLocation || resolveRolePath(result.user.role);
    navigate(destination, { replace: true });
    setIsSubmitting(false);
  };

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl text-slate-900">{roleLabelMap[role]} Login</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to your {roleLabelMap[role].toLowerCase()} portal.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              <PasswordField
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-emerald-700 hover:text-emerald-800">
                Forgot password?
              </Link>
            </div>

            {message ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>

          {selfRegisterRoles.has(role) ? (
            <p className="mt-5 text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link to={`/register/${role}`} className="text-emerald-700 hover:text-emerald-800">
                Create one
              </Link>
            </p>
          ) : (
            <p className="mt-5 text-sm text-slate-600">
              {role === "blogger"
                ? "Blogger accounts are created by university representatives."
                : "Admin accounts are created by the system owner."}
            </p>
          )}
        </section>

        
      </div>
    </div>
  );
};
