"use client";

import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AttemptBandBadge } from "./attempt-band-badge";
import { cn } from "@/lib/cn";
import { AttemptDetail } from "./attempt-detail";
import type { QuestionAttempt } from "@/types/forecast-question";

const VISIBLE_COUNT = 3;

function PreviousAttemptRow({ attempt }: { attempt: QuestionAttempt }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasDetail = attempt.status === "scored" && (attempt.transcript.length > 0 || Boolean(attempt.shortened));

  return (
    <Card className={cn("transition-colors", isExpanded && "border-brand-300")}>
      <button
        type="button"
        aria-expanded={isExpanded}
        disabled={!hasDetail}
        onClick={() => setIsExpanded((value) => !value)}
        className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left disabled:cursor-default"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-ink-400">
          <Play className="size-3.5 fill-current" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-ink-900 tabular-nums">
            Lần {attempt.index} · {attempt.dateLabel} · {attempt.durationLabel}
          </span>
          <span className="block truncate text-sm text-ink-400">
            {attempt.status === "grading"
              ? "Đang chấm điểm…"
              : attempt.status === "scored"
                ? attempt.skills.map((skill) => `${skill.label} ${skill.score}`).join(" · ")
                : "Không chấm được"}
          </span>
        </span>
        {hasDetail ? (
          <span className="flex items-center gap-0.5 text-sm font-bold text-brand-700">
            {isExpanded ? "Thu gọn" : "Xem chi tiết"}
            <ChevronDown className={cn("size-4 transition-transform duration-300", isExpanded && "rotate-180")} />
          </span>
        ) : null}
        <AttemptBandBadge attempt={attempt} size={44} />
      </button>

      <div
        aria-hidden={!isExpanded}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-in-out",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-5 pt-1 pb-5">
            <AttemptDetail attempt={attempt} />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function PreviousAttemptsList({ attempts }: { attempts: QuestionAttempt[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? attempts : attempts.slice(0, VISIBLE_COUNT);
  const hiddenCount = attempts.length - visible.length;

  return (
    <>
      {visible.map((attempt) => (
        <PreviousAttemptRow key={attempt.id} attempt={attempt} />
      ))}
      {attempts.length > VISIBLE_COUNT ? (
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          className="cursor-pointer self-center text-sm font-bold text-brand-700 hover:underline"
        >
          {showAll ? "Ẩn bớt các lần trước" : `Xem thêm ${hiddenCount} lần trước`}
        </button>
      ) : null}
    </>
  );
}
