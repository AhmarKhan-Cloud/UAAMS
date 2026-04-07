import { ArrowRight, Building2, GraduationCap, PenSquare, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const roleCards = [
  {
    title: "Student Portal",
    description: "Discover universities, complete your profile, and track applications from one place.",
    icon: GraduationCap,
    color: "bg-emerald-50 text-emerald-700",
    to: "/register?role=student",
  },
  {
    title: "University Portal",
    description: "Manage form builder, applications, merit lists, and official announcements.",
    icon: Building2,
    color: "bg-blue-50 text-blue-700",
    to: "/register?role=university",
  },
  {
    title: "Blogger Portal",
    description: "Publish trusted admission content and improve campus visibility.",
    icon: PenSquare,
    color: "bg-orange-50 text-orange-700",
    to: "/register?role=blogger",
  },
  {
    title: "Admin Portal",
    description: "Approve institutions, monitor workflows, and secure platform operations.",
    icon: ShieldCheck,
    color: "bg-indigo-50 text-indigo-700",
    to: "/login?role=admin",
  },
];

export const HomePage = () => {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm lg:p-12">
        <p className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700">
          Final Year Project
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl text-slate-900">
          University Admission Management System with Role-Based Workflows
        </h1>
        <p className="mt-4 max-w-3xl text-base text-slate-600">
          A modern multi-role React frontend built with JSX, React Router, protected routing,
          and dashboard-first UX for students, universities, bloggers, and admins.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 items-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-white transition-colors hover:bg-emerald-700"
          >
            <p>Start Registration</p>
            <ArrowRight className="h-4 w-5" />
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-slate-700 transition-colors hover:bg-slate-50"
          >
            <p>Sign In</p>
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {roleCards.map((roleCard) => {
          const Icon = roleCard.icon;

          return (
            <article
              key={roleCard.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className={`mb-4 inline-flex rounded-lg p-3 ${roleCard.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl text-slate-900">{roleCard.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{roleCard.description}</p>
              <Link
                to={roleCard.to}
                className="mt-4 inline-flex items-center gap-1 text-sm text-slate-900 hover:text-emerald-700"
              >
                Open portal
                <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          );
        })}
      </section>
    </div>
  );
};
