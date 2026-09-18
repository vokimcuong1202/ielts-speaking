"use client";

import { cn } from "@/lib/cn";

interface QuestionCountPickerProps {
  options: number[];
  selectedCount: number;
  estimatedMinutes: number;
  hint: string;
  onSelect: (count: number) => void;
}

export function QuestionCountPicker({
  options,
  selectedCount,
  estimatedMinutes,
  hint,
  onSelect,
}: QuestionCountPickerProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wide text-ink-900">Số câu hỏi</h2>
        <p className="text-sm font-semibold text-brand-700">
          {selectedCount} câu · ≈ {estimatedMinutes} phút
        </p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-8">
        {options.map((count) => (
          <button
            key={count}
            type="button"
            onClick={() => onSelect(count)}
            className={cn(
              "flex h-11 items-center justify-center rounded-xl border text-sm font-bold transition-colors",
              count === selectedCount
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-border-strong text-ink-700 hover:bg-page"
            )}
          >
            {count}
          </button>
        ))}
      </div>

      <p className="mt-2 text-xs text-ink-400">{hint}</p>
    </div>
  );
}
