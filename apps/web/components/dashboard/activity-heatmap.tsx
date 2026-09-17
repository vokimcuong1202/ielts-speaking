import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { HeatmapData } from "@/types/dashboard";

const heatColor: Record<number, string> = {
  0: "bg-heat-0",
  1: "bg-heat-1",
  2: "bg-heat-2",
  3: "bg-heat-3",
  4: "bg-heat-4",
};

const CELL_SIZE = 12;
const CELL_GAP = 3;
const COLUMN_WIDTH = CELL_SIZE + CELL_GAP;

export function ActivityHeatmap({ heatmap }: { heatmap: HeatmapData }) {
  return (
    <Card className="flex-1 overflow-x-auto p-6">
      <div className="flex w-fit gap-3">
        <div className="flex flex-col justify-between gap-[3px] pt-5 text-[11px] text-ink-400">
          {heatmap.weekdayLabels.map((label, index) => (
            <span key={index} className="flex h-3 items-center">
              {label}
            </span>
          ))}
        </div>

        <div>
          <div className="relative mb-1 h-4 text-[11px] text-ink-400" style={{ width: heatmap.weeks.length * COLUMN_WIDTH }}>
            {heatmap.monthLabels.map((month) => (
              <span key={month.weekIndex} className="absolute top-0" style={{ left: month.weekIndex * COLUMN_WIDTH }}>
                {month.label}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {heatmap.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = week[dayIndex];
                  return (
                    <div
                      key={dayIndex}
                      title={day?.date}
                      className={cn("h-3 w-3 rounded-[3px]", day ? heatColor[day.level] : "bg-transparent")}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-ink-500">
        <p>
          {heatmap.totalDays} ngày · <span className="font-semibold text-ink-900">{heatmap.activeDays} ngày</span>{" "}
          có luyện
        </p>
        <div className="flex items-center gap-1.5">
          <span>Ít</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} className={cn("h-3 w-3 rounded-[3px]", heatColor[level])} />
          ))}
          <span>Nhiều</span>
        </div>
      </div>
    </Card>
  );
}
