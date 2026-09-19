"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { ForecastGroup } from "@/types/forecast";

interface ForecastGroupNavCardProps {
  group: ForecastGroup;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function ForecastGroupNavCard({ group, isActive, onSelect }: ForecastGroupNavCardProps) {
  const ratio = group.unitCount > 0 ? Math.min(1, group.practicedCount / group.unitCount) : 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(group.id)}
      className={cn(
        "flex min-w-[9.5rem] flex-1 basis-44 cursor-pointer flex-col gap-3 rounded-xl border p-4 text-left transition-colors",
        isActive ? "border-brand-500 bg-brand-50/50" : "border-border bg-surface hover:border-brand-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex flex-col items-start gap-1.5">
          <span className="font-bold leading-snug text-ink-900">{group.label}</span>
          {group.badge ? (
            <Badge variant={group.badge.variant} size="sm" className="whitespace-nowrap">
              {group.badge.label}
            </Badge>
          ) : null}
        </span>
        <span className="shrink-0 whitespace-nowrap pt-0.5 text-sm text-ink-400">
          {group.unitCount} {group.unitLabel}
        </span>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-page">
          <div className="h-full rounded-full bg-brand-600" style={{ width: `${ratio * 100}%` }} />
        </div>

        <p className="text-xs text-ink-400">{group.progressLabel}</p>
      </div>
    </button>
  );
}
