"use client";

import { cn } from "@/lib/cn";
import type { TestHistoryFilter } from "@/types/test-history";

interface HistoryFilterBarProps {
  counts: Record<TestHistoryFilter, number>;
  value: TestHistoryFilter;
  onChange: (value: TestHistoryFilter) => void;
}

const filters: { id: Exclude<TestHistoryFilter, "all">; label: string }[] = [
  { id: "part1", label: "Part 1" },
  { id: "part2", label: "Part 2" },
  { id: "part3", label: "Part 3" },
  { id: "full", label: "Full test" },
];

export function HistoryFilterBar({ counts, value, onChange }: HistoryFilterBarProps) {
  const buttonClass = (active: boolean) =>
    cn(
      "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
      active ? "bg-ink-900 text-white" : "border border-border-strong text-ink-700 hover:bg-page"
    );

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => onChange("all")} className={buttonClass(value === "all")}>
        Tất cả · {counts.all}
      </button>
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onChange(filter.id)}
          className={buttonClass(value === filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
