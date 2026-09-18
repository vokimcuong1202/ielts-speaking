"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { VocabularyFilterCounts } from "@/types/vocabulary";

const filters = [
  { id: "needsReview", label: "Cần ôn" },
  { id: "mastered", label: "Đã thuộc" },
] as const;

export function StatusFilterBar({ counts }: { counts: VocabularyFilterCounts }) {
  const [activeFilterId, setActiveFilterId] = useState<"all" | (typeof filters)[number]["id"]>("all");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveFilterId("all")}
          className={cn(
            "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
            activeFilterId === "all" ? "bg-ink-900 text-white" : "border border-border-strong text-ink-700 hover:bg-page"
          )}
        >
          Tất cả · {counts.all}
        </button>
        {filters.map((filter) => (
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

      <button
        type="button"
        className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-strong px-3.5 py-1.5 text-sm text-ink-700 hover:bg-page"
      >
        <span className="text-ink-400">Nhóm theo</span>
        <span className="font-semibold">Câu hỏi đã luyện</span>
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}
