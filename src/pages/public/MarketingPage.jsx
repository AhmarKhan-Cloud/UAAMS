export const MarketingPage = ({ title, description, points = [] }) => {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl text-slate-900">{title}</h1>
        <p className="mt-3 text-slate-600">{description}</p>

        <div className="mt-6 grid gap-3">
          {points.map((point) => (
            <div key={point} className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
              {point}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};