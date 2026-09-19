"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { ForecastBadge } from "@/types/forecast";

interface ForecastGroupSidebarItemProps {
  id: string;
  title: string;
  badge?: ForecastBadge;
  metaLabel: string;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function ForecastGroupSidebarItem({ id, title, badge, metaLabel, isActive, onSelect }: ForecastGroupSidebarItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        "flex w-full cursor-pointer flex-col gap-2 rounded-xl border px-4 py-3 text-left transition-colors",
        isActive ? "border-brand-500 bg-brand-50/50" : "border-border hover:border-brand-200"
      )}
    >
      <p className="text-sm font-bold text-ink-900">{title}</p>
      <div className="flex items-center justify-between gap-2">
        {badge ? (
          <Badge variant={badge.variant} size="sm">
            {badge.label}
          </Badge>
        ) : (
          <span />
        )}
        <span className="shrink-0 text-xs text-ink-400">{metaLabel}</span>
      </div>
    </button>
  );
}
