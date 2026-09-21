"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AudioLines, Loader2, Square, Zap } from "lucide-react";
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
  /** Hides the question progress strip and the previous / next controls (e.g. when opened from a mock test). */
  hideNavigation?: boolean;
  previous?: QuestionNavLink;
  next?: QuestionNavLink;
}

const arrowClass =
  "flex size-9 shrink-0 items-center justify-center rounded-full border border-border-strong bg-surface text-brand-700 transition-colors";

const formatElapsed = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

function NavLink({ partId, link, direction }: { partId: string; link?: QuestionNavLink; direction: "prev" | "next" }) {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ArrowLeft : ArrowRight;

  if (!link) return <span />;

  return (
    <Link
      href={`/forecast/${partId}/${link.id}`}
      aria-label={`${isPrev ? "Câu trước" : "Câu tiếp theo"}: ${link.title}`}
      className={cn("flex min-w-0 items-center gap-3", !isPrev && "flex-row-reverse justify-self-end text-right")}
    >
      <span className={cn(arrowClass, "hover:bg-brand-50")}>
        <Icon className="size-4" />
      </span>
      <span className="hidden min-w-0 leading-tight sm:block">
        <span className="block text-xs tracking-widest text-ink-400 uppercase">{isPrev ? "Câu trước" : "Câu tiếp theo"}</span>
        <span className="block truncate font-bold text-ink-900">{link.title}</span>
      </span>
    </Link>
  );
}

function IconAction({ label, disabled, onClick, children }: { label: string; disabled: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border-strong bg-surface text-brand-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
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
      {state === "submitting" ? "Đang gửi…" : state === "recording" ? `Dừng · ${formatElapsed(elapsedSeconds)}` : "Ghi âm ngay"}
    </Button>
  );
}

export function PracticeDock({ partId, position, total, topicLabel, remainingToday, ideaSteps, sampleAnswers, record, hideNavigation = false, previous, next }: PracticeDockProps) {
  const [dialog, setDialog] = useState<"sample" | "ideas" | null>(null);

  return (
    <div className="shrink-0 border-t border-border bg-surface">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <IconAction label="Xem đáp án mẫu" disabled={sampleAnswers.length === 0} onClick={() => setDialog("sample")}>
            <AudioLines className="size-5" />
          </IconAction>
          <IconAction label="Gợi ý ý tưởng" disabled={ideaSteps.length === 0} onClick={() => setDialog("ideas")}>
            <Zap className="size-5" />
          </IconAction>
        </div>
        <RecordButton record={record} />
        <div className="flex flex-col items-end text-right text-sm leading-snug">
          {record.error ? (
            <span role="alert" className="text-danger-text">{record.error}</span>
          ) : (
            <>
              <span className="text-ink-500">{record.state === "recording" ? "Đang ghi âm…" : "Micro đã sẵn sàng"}</span>
              {remainingToday !== null ? <span className="text-ink-700">Còn {remainingToday} lượt nói hôm nay</span> : null}
            </>
          )}
        </div>
      </div>

      {hideNavigation ? null : (
        <div className="border-t border-border px-4 py-3 sm:px-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <NavLink partId={partId} link={previous} direction="prev" />
            <div className="flex w-64 max-w-full flex-col items-center gap-1.5 sm:w-96">
              <div aria-hidden className="flex w-full gap-1">
                {Array.from({ length: total }, (_, i) => (
                  <span key={i} className={cn("h-1 flex-1 rounded-full", i + 1 < position ? "bg-brand-600" : i + 1 === position ? "bg-ink-900" : "bg-border")} />
                ))}
              </div>
              <span className="text-sm text-ink-500 tabular-nums">
                Câu {position} / {total} · {topicLabel} ·{" "}
                <Link href="/forecast" className="font-bold text-brand-700 hover:underline">
                  xem cả danh sách ▾
                </Link>
              </span>
            </div>
            <NavLink partId={partId} link={next} direction="next" />
          </div>
        </div>
      )}

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
