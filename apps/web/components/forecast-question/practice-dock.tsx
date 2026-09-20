"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, Square } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { getScoreTone, SCORE_TONE_BADGE_VARIANT } from "@/lib/score-tone";
import { HintDialog } from "./hint-dialog";
import type { RecordState } from "@/hooks/use-record-attempt";
import type { QuestionNavLink, QuestionSampleAnswer } from "@/types/forecast-question";

interface PracticeDockProps {
  partId: string;
  position: number;
  total: number;
  topicLabel: string;
  remainingToday: number | null;
  ideaSteps: string[];
  sampleAnswers: QuestionSampleAnswer[];
  record: { state: RecordState; elapsedSeconds: number; error: string | null; onToggle: () => void };
  previous?: QuestionNavLink;
  next?: QuestionNavLink;
}

const arrowClass =
  "flex size-9 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface text-brand-700 transition-colors";

const formatElapsed = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

function NavArrow({ partId, link, direction }: { partId: string; link?: QuestionNavLink; direction: "prev" | "next" }) {
  const Icon = direction === "prev" ? ArrowLeft : ArrowRight;
  const label = direction === "prev" ? "Câu trước" : "Câu tiếp theo";

  if (!link) {
    return (
      <span aria-hidden className={cn(arrowClass, "opacity-40")}>
        <Icon className="size-4" />
      </span>
    );
  }

  return (
    <Link
      href={`/forecast/${partId}/${link.id}`}
      title={`${label}: ${link.title}`}
      aria-label={`${label}: ${link.title}`}
      className={cn(arrowClass, "hover:bg-brand-50")}
    >
      <Icon className="size-4" />
    </Link>
  );
}

function RecordButton({ record }: { record: PracticeDockProps["record"] }) {
  const { state, elapsedSeconds, onToggle } = record;

  return (
    <Button
      onClick={onToggle}
      disabled={state === "submitting"}
      className={cn("rounded-full px-6 shadow-lg", state === "recording" ? "bg-danger-text shadow-danger-text/25 hover:bg-danger-text/90" : "shadow-brand-600/25")}
    >
      {state === "submitting" ? (
        <Loader2 className="size-4 animate-spin" />
      ) : state === "recording" ? (
        <Square className="size-3 fill-current" />
      ) : (
        <span className="size-3 rounded-full bg-white" />
      )}
      {state === "submitting" ? "Đang gửi…" : state === "recording" ? `Dừng · ${formatElapsed(elapsedSeconds)}` : "Ghi âm lại câu này"}
    </Button>
  );
}

export function PracticeDock({ partId, position, total, topicLabel, remainingToday, ideaSteps, sampleAnswers, record, previous, next }: PracticeDockProps) {
  const [dialog, setDialog] = useState<"sample" | "ideas" | null>(null);

  return (
    <div className="border-t border-border bg-surface shadow-[0_-8px_24px_-12px_rgba(16,55,57,0.15)]">
      <div aria-hidden className="flex gap-0.5">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={cn("h-1 flex-1", i + 1 < position ? "bg-brand-600" : i + 1 === position ? "bg-ink-900" : "bg-border")} />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-8 lg:px-6">
        <Button variant="outline" size="sm" className="rounded-full" disabled={sampleAnswers.length === 0} onClick={() => setDialog("sample")}>
          Xem đáp án mẫu
        </Button>
        <Button variant="outline" size="sm" className="rounded-full" disabled={ideaSteps.length === 0} onClick={() => setDialog("ideas")}>
          Gợi ý ý tưởng
        </Button>

        <div className="ml-auto flex items-center gap-3">
          {record.error ? (
            <span role="alert" className="text-sm text-danger-text">{record.error}</span>
          ) : remainingToday !== null ? (
            <span className="text-sm text-ink-400">Còn {remainingToday} lượt nói hôm nay</span>
          ) : null}
        </div>
        <RecordButton record={record} />

        <div className="flex items-center gap-2 border-l border-border pl-4">
          <NavArrow partId={partId} link={previous} direction="prev" />
          <div className="flex min-w-24 flex-col items-center leading-tight">
            <span className="text-sm font-bold text-ink-900 tabular-nums">
              {position} / {total}
            </span>
            <span className="text-xs text-ink-500">{topicLabel}</span>
          </div>
          <NavArrow partId={partId} link={next} direction="next" />
        </div>
      </div>

      {dialog === "sample" ? (
        <HintDialog title="Đáp án mẫu" onClose={() => setDialog(null)}>
          <div className="flex flex-col gap-5">
            {sampleAnswers.map((sample) => (
              <div key={sample.band}>
                <Badge variant={SCORE_TONE_BADGE_VARIANT[getScoreTone(sample.band)]} size="md">
                  Band {sample.band.toFixed(1)}
                </Badge>
                <p className="mt-2 leading-6 text-ink-900">{sample.body}</p>
                {sample.notes ? <p className="mt-2 text-sm text-ink-500">{sample.notes}</p> : null}
              </div>
            ))}
          </div>
        </HintDialog>
      ) : null}

      {dialog === "ideas" ? (
        <HintDialog title="Gợi ý ý tưởng" onClose={() => setDialog(null)}>
          <ol className="flex flex-col gap-3">
            {ideaSteps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{index + 1}</span>
                <span className="leading-6 text-ink-900">{step}</span>
              </li>
            ))}
          </ol>
        </HintDialog>
      ) : null}
    </div>
  );
}
