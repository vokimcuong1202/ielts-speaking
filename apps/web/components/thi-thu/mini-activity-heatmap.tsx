import { cn } from "@/lib/cn";
import type { TestActivitySummary } from "@/types/test-history";

const heatColor: Record<number, string> = {
  0: "bg-heat-0",
  1: "bg-heat-1",
  2: "bg-heat-2",
  3: "bg-heat-3",
  4: "bg-heat-4",
};

const CELL_SIZE = 8;
const CELL_GAP = 3;
const COLUMN_WIDTH = CELL_SIZE + CELL_GAP;

export function MiniActivityHeatmap({ activity }: { activity: TestActivitySummary }) {
  return (
    <div className="w-fit">
      <div
        className="relative mb-1 h-3.5 text-[10px] text-ink-400"
        style={{ width: activity.weeks.length * COLUMN_WIDTH }}
      >
        {activity.monthLabels.map((month) => (
          <span key={month.weekIndex} className="absolute top-0" style={{ left: month.weekIndex * COLUMN_WIDTH }}>
            {month.label}
          </span>
        ))}
      </div>

      <div className="flex gap-[3px]">
        {activity.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-[3px]">
            {week.map((day, dayIndex) => (
              <div key={dayIndex} title={day.date} className={cn("h-2 w-2 rounded-[2px]", heatColor[day.level])} />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-ink-500">
        <p>
          Đã thi <span className="font-semibold text-ink-900">{activity.totalAttempts} lần</span> · band cao nhất{" "}
          {activity.bestBand.toFixed(1)}
        </p>
        <div className="flex items-center gap-1 text-[11px] text-ink-400">
          <span>Ít</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={cn("h-2 w-2 rounded-[2px]", heatColor[level])} />
          ))}
          <span>Nhiều</span>
        </div>
      </div>
    </div>
  );
}
