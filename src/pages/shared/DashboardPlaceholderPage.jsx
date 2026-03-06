import { DashboardPageShell } from "./DashboardPageShell";

export const DashboardPlaceholderPage = ({ title, subtitle, checklist = [] }) => {
  return (
    <DashboardPageShell title={title} subtitle={subtitle}>
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
        <h2 className="text-slate-900">Planned Deliverables</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-600">
          {checklist.map((item) => (
            <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </DashboardPageShell>
  );
};