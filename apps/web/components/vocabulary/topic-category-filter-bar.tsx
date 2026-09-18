"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { VocabularyTopicCategoryCounts } from "@/types/vocabulary";

const categoryFilters = [
  { id: "collocation", label: "Collocation" },
  { id: "idiom", label: "Idiom" },
  { id: "phrasalVerb", label: "Phrasal verb" },
  { id: "unsaved", label: "Chưa lưu" },
] as const;

export function TopicCategoryFilterBar({
  totalCount,
  counts,
}: {
  totalCount: number;
  counts: VocabularyTopicCategoryCounts;
}) {
  const [activeFilterId, setActiveFilterId] = useState<"all" | (typeof categoryFilters)[number]["id"]>("all");

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setActiveFilterId("all")}
        className={cn(
          "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
          activeFilterId === "all" ? "bg-ink-900 text-white" : "border border-border-strong text-ink-700 hover:bg-page"
        )}
      >
        Tất cả · {totalCount}
      </button>
      {categoryFilters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => setActiveFilterId(filter.id)}
          className={cn(
            "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
            activeFilterId === filter.id
              ? "bg-ink-900 text-white"
              : "border border-border-strong text-ink-700 hover:bg-page"
          )}
        >
          {filter.label} · {counts[filter.id]}
        </button>
      ))}
    </div>
  );
}
