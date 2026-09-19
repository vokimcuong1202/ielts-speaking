"use client";

import { cn } from "@/lib/cn";
import type { ForecastSortId, ForecastSortOption } from "@/types/forecast";

interface ForecastSortBarProps {
  options: ForecastSortOption[];
  activeSortId: ForecastSortId;
  onChange: (id: ForecastSortId) => void;
}

export function ForecastSortBar({ options, activeSortId, onChange }: ForecastSortBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-ink-500">Sắp xếp</span>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={cn(
            "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
            activeSortId === option.id
              ? "bg-brand-50 text-brand-700"
              : "border border-border-strong text-ink-700 hover:bg-page"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
