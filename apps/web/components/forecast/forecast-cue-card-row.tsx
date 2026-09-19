"use client";

import { RotateCcw, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ForecastCueCard } from "@/types/forecast";

interface ForecastCueCardRowProps {
  cueCard: ForecastCueCard;
  onSelect: (id: string) => void;
}

export function ForecastCueCardRow({ cueCard, onSelect }: ForecastCueCardRowProps) {
  const isPracticed = Boolean(cueCard.practiceSummary);

  return (
    <div
      onClick={() => onSelect(cueCard.id)}
      className="flex cursor-pointer flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand-200"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {isPracticed ? (
            <Badge variant="warning" size="sm">
              band gần nhất {cueCard.practiceSummary?.latestBand.toFixed(1)}
            </Badge>
          ) : cueCard.tag ? (
            <Badge variant={cueCard.tag.variant} size="sm">
              {cueCard.tag.label}
            </Badge>
          ) : null}
          <span className="text-sm text-ink-500">{cueCard.rowMetaLabel}</span>
        </div>
        <p className="mt-1.5 text-base font-bold text-ink-900">{cueCard.title}</p>
      </div>

      {isPracticed ? (
        <Button variant="outline" size="sm" className="shrink-0 rounded-full">
          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
          Luyện lại
        </Button>
      ) : (
        <Button variant="primary" size="sm" className="shrink-0 rounded-full">
          <Play className="h-3.5 w-3.5" strokeWidth={2.5} fill="currentColor" />
          Luyện topic này
        </Button>
      )}
    </div>
  );
}
