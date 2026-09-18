"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { ForecastQuestionCard as ForecastQuestionCardData } from "@/types/forecast";

const tagBadgeProps: Record<"hayRa" | "moiVaoBo", { variant: "warning" | "brand"; label: string }> = {
  hayRa: { variant: "warning", label: "HAY RA" },
  moiVaoBo: { variant: "brand", label: "ĐỀ MỚI" },
};

interface ForecastQuestionCardProps {
  question: ForecastQuestionCardData;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ForecastQuestionCard({ question, isSelected, onSelect }: ForecastQuestionCardProps) {
  const tag = question.tag ? tagBadgeProps[question.tag] : null;

  return (
    <div
      onClick={() => onSelect(question.id)}
      className={cn(
        "flex cursor-pointer flex-wrap items-start justify-between gap-4 rounded-2xl border p-5 transition-colors",
        isSelected ? "border-brand-500 bg-brand-50/50" : "border-border bg-surface hover:border-brand-200"
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {tag ? (
            <Badge variant={tag.variant} size="sm">
              {tag.label}
            </Badge>
          ) : null}
          <span className="text-sm text-ink-500">{question.category}</span>
        </div>

        <p className="mt-1.5 text-base font-bold text-ink-900">{question.title}</p>

        <p className="mt-2 text-xs text-ink-400">
          Xuất hiện <span className="font-semibold text-ink-700">{question.occurrenceCount} lần</span> /{" "}
          {question.occurrenceWindowDays} ngày
          {question.extraMetaLabel ? <> · {question.extraMetaLabel}</> : null}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5 text-right">
        {question.practice.kind === "practiced" ? (
          <>
            <p className="text-xl font-extrabold text-ink-900">{question.practice.band.toFixed(1)}</p>
            <p className="text-xs text-ink-400">band gần nhất</p>
          </>
        ) : (
          <>
            <p className="text-xs text-ink-400">chưa luyện</p>
            <Button variant="primary" size="sm" className="rounded-full">
              Luyện ngay
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
