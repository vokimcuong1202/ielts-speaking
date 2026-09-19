interface ForecastSidebarProgressCardProps {
  title: string;
  practicedCount: number;
  totalCount: number;
  unitLabel: string;
}

export function ForecastSidebarProgressCard({ title, practicedCount, totalCount, unitLabel }: ForecastSidebarProgressCardProps) {
  const ratio = totalCount > 0 ? Math.min(1, practicedCount / totalCount) : 0;

  return (
    <div className="rounded-xl bg-brand-50/60 p-4">
      <p className="text-xs font-bold tracking-wide text-brand-700 uppercase">{title}</p>
      <p className="mt-1 text-sm text-ink-700">
        Đã luyện <span className="font-extrabold text-ink-900">{practicedCount}</span>/{totalCount} {unitLabel}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${ratio * 100}%` }} />
      </div>
    </div>
  );
}
