import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { roleLabelMap } from "../../utils/rolePaths";

const roleOptions = ["student", "university"];

const defaultForm = {
  role: "student",
  name: "",
  representativeName: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  phone: "",
  location: "",
  website: "",
  establishedYear: "",
  studentCount: "",
  programsOffered: "",
};

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useAuth();

  const initialRole = searchParams.get("role");
  const [formData, setFormData] = useState({
    ...defaultForm,
    role: roleOptions.includes(initialRole) ? initialRole : "student",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isUniversity = useMemo(
    () => formData.role === "university",
    [formData.role],
  );


  const updateField = (field, value) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = register(formData);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    setMessage(result.message);

    setTimeout(() => {
      navigate(`/login?role=${formData.role}`);
    }, 1000);
  };

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-5xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl text-slate-900">Create your UAAMS account</h1>
        <p className="mt-2 text-sm text-slate-600">
          Register as student, university.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-700">Role</label>
            <select
              value={formData.role}
              onChange={(event) => updateField("role", event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {roleLabelMap[option]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-700">
                {isUniversity ? "University Name" : "Full Name"}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder={isUniversity ? "Enter university name" : "Enter your full name"}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="your.email@example.com"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>


          {isUniversity ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-700">Representative Name</label>
                  <input
                    type="text"
                    value={formData.representativeName}
                    onChange={(event) => updateField("representativeName", event.target.value)}
                    placeholder="Enter representative's full name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-700">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                    placeholder="+92-300-1234567"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-700">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(event) => updateField("location", event.target.value)}
                    placeholder="City, Province"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm text-slate-700">Website</label>
                  <input
                  placeholder="http://www.myUniversity.com"
                    type="url"
                    value={formData.website}
                    onChange={(event) => updateField("website", event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-700">Established Year</label>
                  <input
                    type="number"
                    value={formData.establishedYear}
                    onChange={(event) => updateField("establishedYear", event.target.value)}
                    placeholder="e.g., 1990"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-slate-700">Students</label>
                  <input
                    type="number"
                    value={formData.studentCount}
                    onChange={(event) => updateField("studentCount", event.target.value)}
                    placeholder="e.g., 5000"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-700">Programs Offered</label>
                <textarea
                  rows={3}
                  value={formData.programsOffered}
                  onChange={(event) => updateField("programsOffered", event.target.value)}
                  placeholder="List the programs offered (e.g., Computer Science, Business Administration, Engineering)"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-700">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(event) => updateField("password", event.target.value)}
                placeholder="Create a strong password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-700">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(event) => updateField("confirmPassword", event.target.value)}
                placeholder="Re-enter your password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}

          {message ? (
            <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white transition-colors hover:bg-emerald-700"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          Already have an account? {" "}
          <Link to="/login" className="text-emerald-700 hover:text-emerald-800">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  );
};