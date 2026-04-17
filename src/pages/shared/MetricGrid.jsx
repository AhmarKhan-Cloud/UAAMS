export const MetricGrid = ({ metrics = [], onMetricClick = null, activeMetricLabel = "" }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <button
          key={metric.label}
          type="button"
          onClick={() => onMetricClick?.(metric)}
          className={`rounded-xl border bg-white p-4 text-left shadow-sm transition ${
            activeMetricLabel === metric.label
              ? "border-blue-400 ring-2 ring-blue-100"
              : "border-slate-200"
          } ${onMetricClick ? "hover:-translate-y-0.5 hover:shadow-md" : ""}`}
        >
          <div className=" text-sm text-slate-500">{metric.label}</div>
          <div className="mt-3 text-3xl text-slate-900">{metric.value}</div>
          <p className="mt-1 text-xs text-slate-500">{metric.trend}</p>
        </button>
      ))}
    </div>
  );
};
