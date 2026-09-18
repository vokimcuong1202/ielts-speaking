import { Badge } from "@/components/ui/badge";
import { ForecastProgressCard } from "./forecast-progress-card";
import type { ForecastQuarterInfo, ForecastQuarterProgress } from "@/types/forecast";

export function ForecastHeader({
  quarter,
  progress,
}: {
  quarter: ForecastQuarterInfo;
  progress: ForecastQuarterProgress;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">Luyện Forecast</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-extrabold text-ink-900 sm:text-3xl">{quarter.title}</h1>
          <Badge variant="brand" size="md">
            {quarter.rangeLabel}
          </Badge>
        </div>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-500">{quarter.description}</p>
      </div>

      <ForecastProgressCard progress={progress} />
    </div>
  );
}
