export const DashboardPageShell = ({
  title,
  subtitle,
  actions,
  children,
}) => {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl text-slate-900">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">{subtitle}</p>
          </div>
          {actions ? <div className="flex gap-2">{actions}</div> : null}
        </div>
      </div>

      {children}
    </section>
  );
};