"use client";

import { ForecastTopicSidebarItem } from "./forecast-topic-sidebar-item";
import type { ForecastTopic } from "@/types/forecast";

interface ForecastTopicSidebarProps {
  partLabel: string;
  topics: ForecastTopic[];
  activeTopicId: string | null;
  onSelectTopic: (id: string) => void;
}

export function ForecastTopicSidebar({ partLabel, topics, activeTopicId, onSelectTopic }: ForecastTopicSidebarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-xs font-bold tracking-wide text-ink-400 uppercase">
          {topics.length} topic {partLabel}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-400">
          <span>
            <span className="font-bold text-brand-600">MỚI</span> topic mới vào bộ
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> có câu hỏi mới
          </span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {topics.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border-strong px-4 py-6 text-center text-sm text-ink-400">
            Không có topic phù hợp.
          </p>
        ) : (
          topics.map((topic) => (
            <ForecastTopicSidebarItem
              key={topic.id}
              topic={topic}
              isActive={topic.id === activeTopicId}
              onSelect={onSelectTopic}
            />
          ))
        )}
      </div>
    </div>
  );
}
