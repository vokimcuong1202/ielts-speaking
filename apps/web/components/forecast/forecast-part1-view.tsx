"use client";

import { useMemo, useState } from "react";
import { ForecastSortBar } from "./forecast-sort-bar";
import { ForecastTopicSidebar } from "./forecast-topic-sidebar";
import { ForecastTopicCard } from "./forecast-topic-card";
import type { ForecastPart1Data, ForecastSortId, ForecastTopic } from "@/types/forecast";

function sortTopics(topics: ForecastTopic[], sortId: ForecastSortId): ForecastTopic[] {
  if (sortId === "unpracticed") {
    return [...topics].sort((a, b) => Number(Boolean(a.practiceSummary)) - Number(Boolean(b.practiceSummary)));
  }
  if (sortId === "newestTopic") {
    return [...topics].sort((a, b) => Number(b.isNewTopic) - Number(a.isNewTopic));
  }
  return topics;
}

function matchesSearch(topic: ForecastTopic, query: string): boolean {
  if (!query) return true;
  const normalizedQuery = query.trim().toLowerCase();
  if (topic.name.toLowerCase().includes(normalizedQuery)) return true;
  return topic.questions.some((question) => question.title.toLowerCase().includes(normalizedQuery));
}

interface ForecastPart1ViewProps {
  data: ForecastPart1Data;
  partLabel: string;
  hideAnswered: boolean;
  search: string;
}

export function ForecastPart1View({ data, partLabel, hideAnswered, search }: ForecastPart1ViewProps) {
  const [activeSortId, setActiveSortId] = useState<ForecastSortId>(data.sortOptions[0]?.id ?? "newestTopic");
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  const visibleTopics = useMemo(
    () => sortTopics(data.topics.filter((topic) => matchesSearch(topic, search)), activeSortId),
    [data.topics, activeSortId, search]
  );

  const currentActiveTopicId = activeTopicId ?? visibleTopics[0]?.id ?? null;

  function handleSelectTopic(id: string) {
    setActiveTopicId(id);
    document.getElementById(`forecast-topic-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <ForecastSortBar options={data.sortOptions} activeSortId={activeSortId} onChange={setActiveSortId} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <ForecastTopicSidebar
          partLabel={partLabel}
          topics={visibleTopics}
          activeTopicId={currentActiveTopicId}
          onSelectTopic={handleSelectTopic}
        />

        <div className="flex flex-col gap-6">
          {visibleTopics.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border-strong px-6 py-12 text-center text-sm text-ink-400">
              Không tìm thấy đề phù hợp với từ khoá &ldquo;{search}&rdquo;.
            </p>
          ) : (
            visibleTopics.map((topic) => (
              <ForecastTopicCard
                key={topic.id}
                topic={topic}
                isActive={topic.id === currentActiveTopicId}
                hideAnswered={hideAnswered}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
