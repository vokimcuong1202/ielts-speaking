"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, Pause, Play } from "lucide-react";
import { Collapsible } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { getScoreTone, SCORE_TONE_BADGE_VARIANT } from "@/lib/score-tone";
import { cn } from "@/lib/cn";
import { useAudioPlayer } from "@/hooks/use-audio-player";
import { AttemptBandBadge } from "./attempt-band-badge";
import { AttemptTranscript } from "./attempt-transcript";
import { AttemptDetail } from "./attempt-detail";
import { ReportMenu } from "./report-menu";
import type {
  AttemptReportReason,
  QuestionAttempt,
} from "@/types/forecast-question";

const PAGE_SIZE = 5;

type AudioPlayer = ReturnType<typeof useAudioPlayer>;

/** What the learner actually said: the transcript without the suggested additions. */
const spokenText = (attempt: QuestionAttempt) =>
  attempt.transcript
    .filter((segment) => segment.kind !== "added")
    .map((segment) => segment.text)
    .join("");

const STATUS_PREVIEW: Record<
  Exclude<QuestionAttempt["status"], "scored">,
  string
> = {
  grading: "Đang chấm điểm…",
  invalid: "Bài nói không hợp lệ",
  failed: "Không chấm được bài nói này",
};

const actionClass =
  "cursor-pointer text-sm font-bold text-brand-700 hover:underline";

function CollapseButton({
  isExpanded,
  onToggle,
}: {
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={isExpanded}
      aria-label={isExpanded ? "Thu gọn chi tiết" : "Xem chi tiết"}
      onClick={onToggle}
      className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-border-strong bg-surface text-ink-500 hover:bg-page"
    >
      <ChevronDown
        className={cn(
          "size-4 transition-transform duration-300",
          isExpanded && "rotate-180",
        )}
      />
    </button>
  );
}

function PlayButton({
  attempt,
  player,
}: {
  attempt: QuestionAttempt;
  player: AudioPlayer;
}) {
  const { audioUrl } = attempt;
  const isPlaying = player.playingId === attempt.id;
  const Icon = isPlaying ? Pause : Play;

  return (
    <button
      type="button"
      aria-label={isPlaying ? "Dừng phát" : "Phát lại"}
      disabled={!audioUrl}
      onClick={() => audioUrl && player.toggle(attempt.id, audioUrl)}
      className={cn(
        "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-500 text-brand-600 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40",
        isPlaying && "bg-brand-50",
      )}
    >
      <Icon className="size-4 fill-current" />
    </button>
  );
}

function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // The share sheet was dismissed or the clipboard is blocked; nothing to recover.
    }
  }

  return (
    <button type="button" className={actionClass} onClick={share}>
      {copied ? "Đã sao chép liên kết" : "Chia sẻ ↗"}
    </button>
  );
}

function SkillBadges({
  attempt,
  tinted,
}: {
  attempt: QuestionAttempt;
  tinted: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {attempt.skills.map((skill) => (
        <Badge
          key={skill.id}
          variant={
            tinted
              ? SCORE_TONE_BADGE_VARIANT[getScoreTone(skill.score)]
              : "neutral"
          }
          size="md"
          className={cn(
            "px-3 py-1 text-sm",
            tinted ? "font-bold" : "font-medium",
          )}
        >
          {skill.label}: {skill.score}
        </Badge>
      ))}
    </div>
  );
}

const attemptMeta = (attempt: QuestionAttempt) =>
  `Lần ${attempt.index} · ${attempt.dateLabel} · ${attempt.durationLabel}`;

function AttemptRow({
  attempt,
  previousBand,
  isLatest,
  player,
  onReport,
}: {
  attempt: QuestionAttempt;
  previousBand: number | null;
  isLatest: boolean;
  player: AudioPlayer;
  onReport: (
    attemptId: string,
    reason: AttemptReportReason,
  ) => Promise<unknown>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isScored = attempt.status === "scored";
  const toggle = () => setIsExpanded((value) => !value);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border transition-[background-color,border-color,box-shadow] duration-300",
        isExpanded
          ? "border-brand-400 bg-[#F7FCFD] shadow-[var(--shadow-card)]"
          : cn("border-border", isLatest ? "bg-[#FBFCFD]" : "bg-surface"),
      )}
    >
      <div className="flex gap-4 p-5">
        <PlayButton attempt={attempt} player={player} />
        <div className="min-w-0 flex-1">
          {!isScored ? (
            <p className="leading-6 text-ink-500">
              {
                STATUS_PREVIEW[
                  attempt.status as Exclude<QuestionAttempt["status"], "scored">
                ]
              }
            </p>
          ) : isExpanded ? (
            <AttemptTranscript segments={attempt.transcript} />
          ) : (
            <p className="leading-6 text-ink-900">{spokenText(attempt)}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <SkillBadges attempt={attempt} tinted={isExpanded} />
            <span className="text-xs text-ink-400 tabular-nums">
              {attemptMeta(attempt)}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-2">
          <AttemptBandBadge attempt={attempt} size={isExpanded ? 64 : 56} />
          {isExpanded ? (
            isScored ? (
              <ReportMenu onReport={(reason) => onReport(attempt.id, reason)} />
            ) : null
          ) : (
            <CollapseButton isExpanded={false} onToggle={toggle} />
          )}
        </div>
      </div>

      <Collapsible isOpen={isExpanded}>
        <div className="border-t border-brand-100 px-5 py-5">
          <AttemptDetail attempt={attempt} previousBand={previousBand} />
        </div>

        {isScored ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-brand-100 px-5 py-4">
            <ShareButton />
            <span className="ml-auto" />
            <button type="button" className={actionClass}>
              Mở rộng ý tưởng
            </button>
            <button type="button" className={actionClass}>
              Shadowing câu này
            </button>
            <button type="button" className={actionClass}>
              Cải thiện câu
            </button>
          </div>
        ) : null}

        <div className="flex justify-center pb-4">
          <CollapseButton isExpanded onToggle={toggle} />
        </div>
      </Collapsible>
    </div>
  );
}

interface AttemptListProps {
  attempts: QuestionAttempt[];
  onReport: (
    attemptId: string,
    reason: AttemptReportReason,
  ) => Promise<unknown>;
  onClose: () => void;
}

export function AttemptList({ attempts, onReport, onClose }: AttemptListProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const player = useAudioPlayer();

  // The API returns attempts newest first.
  const latestId = attempts[0]?.id;
  const visible = attempts.slice(0, visibleCount);
  const hiddenCount = attempts.length - visible.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="flex cursor-pointer items-center gap-1 text-sm font-bold text-brand-700 hover:underline"
        >
          Ẩn các lần nói
          <ChevronUp className="size-4" />
        </button>
      </div>

      {visible.map((attempt, index) => (
        <AttemptRow
          key={attempt.id}
          attempt={attempt}
          previousBand={attempts[index + 1]?.band ?? null}
          isLatest={attempt.id === latestId}
          player={player}
          onReport={onReport}
        />
      ))}

      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="flex cursor-pointer items-center gap-1 self-center text-sm font-bold text-brand-700 hover:underline"
        >
          Tải thêm {hiddenCount} lần trước
          <ArrowRight className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
