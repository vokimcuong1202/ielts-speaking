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
        "flex flex-1 basis-40 cursor-pointer flex-col gap-2 rounded-xl border p-4 text-left transition-colors",
        isActive ? "border-brand-500 bg-brand-50/50" : "border-border bg-surface hover:border-brand-200"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5">
          <span className="font-bold text-ink-900">{group.label}</span>
          {group.badge ? (
            <Badge variant={group.badge.variant} size="sm">
              {group.badge.label}
            </Badge>
          ) : null}
        </span>
        <span className="shrink-0 text-sm text-ink-400">
          {group.unitCount} {group.unitLabel}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-page">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${ratio * 100}%` }} />
      </div>

      <p className="text-xs text-ink-400">{group.progressLabel}</p>
    </button>
  );
}
