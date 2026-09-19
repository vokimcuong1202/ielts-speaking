"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
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
        "flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors",
        isActive ? "border-brand-500 bg-brand-50/50 text-ink-900" : "border-border text-ink-700 hover:border-brand-200"
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
          <Badge variant="warning" size="sm">
            band {topic.practiceSummary.latestBand.toFixed(1)}
          </Badge>
        ) : null}
      </span>
    </button>
  );
}
