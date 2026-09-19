export function ForecastPageHeader({ quarterLabel, partTitle }: { quarterLabel: string; partTitle: string }) {
  return (
    <div>
      <p className="text-xs font-bold tracking-wide text-brand-600 uppercase">{quarterLabel}</p>
      <h1 className="mt-1 text-2xl font-extrabold text-ink-900 sm:text-3xl">{partTitle}</h1>
    </div>
  );
}
