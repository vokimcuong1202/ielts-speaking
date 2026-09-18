import { Card } from "@/components/ui/card";
import type { ForecastQuarterProgress } from "@/types/forecast";

export function ForecastProgressCard({ progress }: { progress: ForecastQuarterProgress }) {
  const ratio = Math.min(1, progress.practicedCount / progress.totalCount);

  return (
    <Card className="w-full max-w-sm p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-ink-500">Tiến độ quý này</p>
        <p className="text-lg font-extrabold text-ink-900">
          {progress.practicedCount}
          <span className="text-sm font-medium text-ink-400">/{progress.totalCount} đề</span>
        </p>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-page">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${ratio * 100}%` }} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-page px-3 py-2.5">
          <p className="text-lg font-extrabold text-ink-900">{progress.averageBand.toFixed(1)}</p>
          <p className="text-xs text-ink-500">band TB đề forecast</p>
        </div>
        <div className="rounded-xl bg-page px-3 py-2.5">
          <p className="text-lg font-extrabold text-ink-900">{progress.hotUnpracticedCount}</p>
          <p className="text-xs text-ink-500">đề hay ra chưa luyện</p>
        </div>
      </div>
    </Card>
  );
}
