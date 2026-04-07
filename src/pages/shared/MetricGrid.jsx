export const MetricGrid = ({ metrics = [] }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <article
          key={metric.label}
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className=" text-sm text-slate-500">{metric.label}</div>
          <div className="mt-3 text-3xl text-slate-900">{metric.value}</div>
          <p className="mt-1 text-xs text-slate-500">{metric.trend}</p>
        </article>
      ))}
    </div>
  );
};
