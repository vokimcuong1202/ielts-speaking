"use client";

import { cn } from "@/lib/cn";
import type { ForecastPartId, ForecastPartTab } from "@/types/forecast";

interface ForecastPartTabsProps {
  parts: ForecastPartTab[];
  activePartId: ForecastPartId;
  onChange: (id: ForecastPartId) => void;
}

export function ForecastPartTabs({ parts, activePartId, onChange }: ForecastPartTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {parts.map((part) => (
        <button
          key={part.id}
          type="button"
          onClick={() => onChange(part.id)}
          className={cn(
            "cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
            activePartId === part.id ? "bg-ink-900 text-white" : "border border-border-strong text-ink-700 hover:bg-page"
          )}
        >
          {part.label}
        </button>
      ))}
    </div>
  );
}
