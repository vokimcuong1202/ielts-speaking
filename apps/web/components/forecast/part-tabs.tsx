"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { ForecastPartTab } from "@/types/forecast";

export function PartTabs({ parts }: { parts: ForecastPartTab[] }) {
  const [activePartId, setActivePartId] = useState<ForecastPartTab["id"]>("part2");

  return (
    <div className="flex flex-wrap gap-2">
      {parts.map((part) => (
        <button
          key={part.id}
          type="button"
          onClick={() => setActivePartId(part.id)}
          className={cn(
            "cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
            activePartId === part.id ? "bg-ink-900 text-white" : "border border-border-strong text-ink-700 hover:bg-page"
          )}
        >
          {part.label} · {part.count}
        </button>
      ))}
    </div>
  );
}
