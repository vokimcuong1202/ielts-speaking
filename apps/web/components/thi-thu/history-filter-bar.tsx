"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

interface HistoryFilterBarProps {
  totalCount: number;
}

const filters = [
  { id: "part1", label: "Part 1" },
  { id: "part2", label: "Part 2" },
  { id: "part3", label: "Part 3" },
  { id: "full", label: "Full test" },
] as const;

export function HistoryFilterBar({ totalCount }: HistoryFilterBarProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | (typeof filters)[number]["id"]>("all");

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setActiveFilter("all")}
        className={cn(
          "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
          activeFilter === "all" ? "bg-ink-900 text-white" : "border border-border-strong text-ink-700 hover:bg-page"
        )}
      >
        Tất cả · {totalCount}
      </button>
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => setActiveFilter(filter.id)}
          className={cn(
            "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
            activeFilter === filter.id
              ? "bg-ink-900 text-white"
              : "border border-border-strong text-ink-700 hover:bg-page"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
