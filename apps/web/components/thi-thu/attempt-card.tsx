"use client";

import { useState } from "react";
import { ChevronDown, Download, Play, RotateCcw, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { BandBadge } from "./band-badge";
import { SkillTagsRow } from "./skill-tags-row";
import { QuestionReviewItem } from "./question-review-item";
import type { TestAttempt } from "@/types/test-history";

export function AttemptCard({ attempt }: { attempt: TestAttempt }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const canExpand = Boolean(attempt.detail);
  const hasQuestions = Boolean(attempt.detail?.questions.length);

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 transition-colors duration-300",
        attempt.status === "invalid"
          ? "border-danger-border bg-danger-bg/50"
          : attempt.status === "completed" && isExpanded
            ? "border-brand-400 bg-surface border-l-4 border-l-brand-600"
            : "border-border bg-surface"
      )}
    >
      <div
        role={canExpand ? "button" : undefined}
        tabIndex={canExpand ? 0 : undefined}
        onClick={canExpand ? () => setIsExpanded((value) => !value) : undefined}
        onKeyDown={
          canExpand
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setIsExpanded((value) => !value);
                }
              }
            : undefined
        }
        className={cn(
          "flex flex-wrap items-start justify-between gap-4",
          canExpand && "-m-1 cursor-pointer rounded-xl p-1 outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wide text-ink-900">{attempt.title}</span>
            {attempt.retryCount ? (
              <Badge variant="brand" size="sm">
                <RotateCcw className="h-3 w-3" strokeWidth={2.5} />
                Thi lại {attempt.retryCount}
              </Badge>
            ) : null}
            {attempt.status === "invalid" ? (
              <Badge variant="danger" size="sm">
                Không tính điểm
              </Badge>
            ) : null}
            {attempt.status === "grading" ? <Badge variant="brandSolid" size="sm">Đang chấm</Badge> : null}
          </div>

          {attempt.summary ? (
            <p className={cn("mt-1.5 text-sm", attempt.status === "invalid" ? "text-danger-text" : "text-ink-500")}>
              {attempt.summary}
            </p>
          ) : null}

          {attempt.status === "grading" && attempt.gradingPercent != null ? (
            <div className="mt-3 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-page">
              <div className="h-full rounded-full bg-brand-600" style={{ width: `${attempt.gradingPercent}%` }} />
            </div>
          ) : null}

          {attempt.status === "completed" && attempt.skills ? (
            <div className="mt-2.5">
              <SkillTagsRow skills={attempt.skills} />
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          <span className="text-xs text-ink-400">{attempt.timestamp}</span>
          {attempt.deltaFromFirstAttempt != null ? (
            <span className="text-xs font-semibold text-success-text">
              ↑ +{attempt.deltaFromFirstAttempt.toFixed(1)} so với lần đầu
            </span>
          ) : null}
          <div className="mt-1">
            <BandBadge status={attempt.status} band={attempt.band} gradingPercent={attempt.gradingPercent} />
          </div>
          {canExpand ? (
            <span className="flex items-center gap-0.5 text-xs font-semibold text-ink-500">
              {isExpanded ? attempt.collapseLabel ?? "Đóng chi tiết" : attempt.expandLabel ?? "Mở chi tiết"}
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform duration-300", isExpanded && "rotate-180")}
              />
            </span>
          ) : null}
        </div>
      </div>

      {attempt.detail ? (
        <div
          aria-hidden={!isExpanded}
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-in-out",
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div
              className={cn(
                "mt-5 border-t border-border pt-4 transition-opacity duration-300",
                isExpanded ? "opacity-100 delay-150" : "opacity-0"
              )}
            >
              {attempt.status === "completed" ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outlineBrand" size="sm" className="rounded-full">
                      <Play className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
                      Nghe lại cả bài
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Share2 className="h-3.5 w-3.5" strokeWidth={2} />
                      Chia sẻ
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Download className="h-3.5 w-3.5" strokeWidth={2} />
                      Tải bản ghi
                    </Button>
                  </div>
                  <Button variant="primary" size="sm" className="rounded-full">
                    <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.5} />
                    Thi lại {attempt.title.replace(/^Test /i, "")}
                  </Button>
                </div>
              ) : null}

              {attempt.detail.note ? (
                <p className={cn("text-sm text-ink-500", attempt.status === "completed" && "mt-4")}>
                  {attempt.detail.note}
                </p>
              ) : null}

              {hasQuestions ? (
                <div className={cn(attempt.status === "completed" || attempt.detail.note ? "mt-5" : undefined)}>
                  <div className="mt-3 flex flex-col gap-3">
                    {attempt.detail.questions.map((question) => (
                      <QuestionReviewItem key={question.id} question={question} />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
