"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const sortOptions = [
  { id: "probability", label: "Xác suất ra đề" },
  { id: "newest", label: "Đề mới vào bộ" },
  { id: "unpracticed", label: "Chưa luyện trước" },
  { id: "bandAsc", label: "Band thấp → cao" },
  { id: "longestUnpracticed", label: "Luyện lâu nhất chưa lại" },
  { id: "topicAz", label: "Nhóm chủ đề A→Z" },
] as const;

export function SortFilterBar() {
  const [activeSortId, setActiveSortId] = useState<(typeof sortOptions)[number]["id"]>("probability");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-ink-500">Sắp xếp theo</span>
      {sortOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setActiveSortId(option.id)}
          className={cn(
            "cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
            activeSortId === option.id
              ? "bg-brand-50 text-brand-700"
              : "border border-border-strong text-ink-700 hover:bg-page"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
