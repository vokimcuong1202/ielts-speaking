"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { HeatmapData, HeatmapDay } from "@/types/dashboard";

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
const LABEL_GAP = 12;
const MIN_LABEL_SPAN = 3;

const weekdayFullLabels = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];

function formatHeatmapDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${weekdayFullLabels[date.getDay()]}, ${dd}/${mm}`;
}

type HoveredDay = { day: HeatmapDay; x: number; y: number };

export function ActivityHeatmap({ heatmap }: { heatmap: HeatmapData }) {
  const [hovered, setHovered] = useState<HoveredDay | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const [maxWeeks, setMaxWeeks] = useState(heatmap.weeks.length);

  useEffect(() => {
    const card = cardRef.current;
    const labels = labelsRef.current;
    if (!card || !labels) return;

    function measure() {
      if (!card || !labels) return;
      const available = card.clientWidth - labels.offsetWidth - LABEL_GAP;
      setMaxWeeks(Math.max(1, Math.floor((available + CELL_GAP) / COLUMN_WIDTH)));
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const { weeks, monthLabels, totalDays, activeDays } = useMemo(() => {
    const offset = Math.max(0, heatmap.weeks.length - maxWeeks);
    const visibleWeeks = heatmap.weeks.slice(offset);
    const shifted = heatmap.monthLabels
      .filter((month) => month.weekIndex >= offset)
      .map((month) => ({ ...month, weekIndex: month.weekIndex - offset }));
    const visibleLabels = shifted.filter(
      (month, index) => index === shifted.length - 1 || shifted[index + 1].weekIndex - month.weekIndex >= MIN_LABEL_SPAN
    );
    const days = visibleWeeks.flat();
    return {
      weeks: visibleWeeks,
      monthLabels: visibleLabels,
      totalDays: days.length,
      activeDays: days.filter((day) => day.sessionCount > 0).length,
    };
  }, [heatmap, maxWeeks]);

  function handleEnter(day: HeatmapDay | undefined, event: React.MouseEvent<HTMLDivElement>) {
    if (!day) return;
    const cellRect = event.currentTarget.getBoundingClientRect();
    setHovered({
      day,
      x: cellRect.left + cellRect.width / 2,
      y: cellRect.top,
    });
  }

  return (
    <Card className="flex min-w-0 flex-1 flex-col overflow-x-auto p-6">
      <div ref={cardRef} className="relative mb-4 flex w-full gap-3">
        <div ref={labelsRef} className="flex flex-col justify-between gap-[3px] pt-5 text-[11px] text-ink-400">
          {heatmap.weekdayLabels.map((label, index) => (
            <span key={index} className="flex h-3 items-center">
              {label}
            </span>
          ))}
        </div>

        <div>
          <div className="relative mb-1 h-4 text-[11px] text-ink-400" style={{ width: weeks.length * COLUMN_WIDTH }}>
            {monthLabels.map((month) => (
              <span key={month.weekIndex} className="absolute top-0" style={{ left: month.weekIndex * COLUMN_WIDTH }}>
                {month.label}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px]">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, dayIndex) => {
                  const day = week[dayIndex];
                  return (
                    <div
                      key={dayIndex}
                      onMouseEnter={(event) => handleEnter(day, event)}
                      onMouseLeave={() => setHovered(null)}
                      className={cn(
                        "h-3 w-3 rounded-[3px] transition-transform duration-150 ease-out",
                        day ? heatColor[day.level] : "bg-transparent",
                        day && "cursor-pointer hover:z-10 hover:scale-125 hover:ring-2 hover:ring-brand-600"
                      )}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {hovered && (
          <div
            className="animate-tooltip-in pointer-events-none fixed z-50 whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs text-white shadow-lg"
            style={{ left: hovered.x, top: hovered.y }}
          >
            <p className="font-semibold">{formatHeatmapDate(hovered.day.date)}</p>
            <p className="text-[11px] text-white/70">
              {hovered.day.sessionCount > 0 ? `${hovered.day.sessionCount} lần luyện` : "Chưa luyện"}
            </p>
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-ink-900" />
          </div>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4 text-xs text-ink-500">
        <p>
          {totalDays} ngày · <span className="font-semibold text-ink-900">{activeDays} ngày</span>{" "}
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
