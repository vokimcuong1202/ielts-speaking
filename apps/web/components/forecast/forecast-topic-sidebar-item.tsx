"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { getScoreTone, SCORE_TONE_BADGE_VARIANT } from "@/lib/score-tone";
import type { ForecastTopic } from "@/types/forecast";

interface ForecastTopicSidebarItemProps {
  topic: ForecastTopic;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function ForecastTopicSidebarItem({ topic, isActive, onSelect }: ForecastTopicSidebarItemProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(topic.id)}
      className={cn(
        "flex w-full cursor-pointer bg-white items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
        isActive ? "border-brand-600 text-ink-900 shadow-[0_0_0_3px_rgba(36,104,108,0.18),0_8px_20px_-8px_rgba(36,104,108,0.45)]" : "border-border text-ink-700 hover:border-brand-200"
      )}
    >
      <span className="min-w-0 truncate">{topic.name}</span>

      <span className="flex shrink-0 items-center gap-1.5">
        {topic.isNewTopic ? (
          <Badge variant="brand" size="sm">
            MỚI
          </Badge>
        ) : null}
        {!topic.isNewTopic && topic.hasNewQuestions ? <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> : null}
        {topic.practiceSummary ? (
          <Badge variant={SCORE_TONE_BADGE_VARIANT[getScoreTone(topic.practiceSummary.latestBand)]} size="sm">
            band {topic.practiceSummary.latestBand.toFixed(1)}
          </Badge>
        ) : null}
      </span>
    </button>
  );
}
