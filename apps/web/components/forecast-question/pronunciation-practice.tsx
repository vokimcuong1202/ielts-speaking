"use client";

import { Loader2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { PronunciationState } from "@/hooks/use-pronunciation-check";
import type { PronunciationResult } from "@/types/answer-support";

interface PronunciationPracticeProps {
  value: string;
  onValueChange: (value: string) => void;
  state: PronunciationState;
  elapsedSeconds: number;
  error: string | null;
  result: PronunciationResult | null;
  isMock: boolean;
  onStart: () => void;
  onStop: () => void;
}

const formatElapsed = (seconds: number) => `0:${String(seconds).padStart(2, "0")}`;

export function PronunciationPractice({ value, onValueChange, state, elapsedSeconds, error, result, isMock, onStart, onStop }: PronunciationPracticeProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-brand-200 bg-brand-50/40 p-3">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (state === "recording") onStop();
          else if (state === "idle") onStart();
        }}
        className="flex items-center gap-2"
      >
        <input
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          disabled={state !== "idle"}
          maxLength={200}
          placeholder="Nhập từ/cụm từ để luyện phát âm…"
          aria-label="Từ hoặc cụm từ cần luyện phát âm"
          className="h-10 min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-ink-400"
        />
        <Button
          type="submit"
          disabled={state === "checking" || (state === "idle" && !value.trim())}
          className={cn("shrink-0 rounded-full", state === "recording" && "bg-danger-text hover:bg-danger-text/90")}
        >
          {state === "checking" ? <Loader2 className="size-4 animate-spin" /> : state === "recording" ? <Square className="size-3 fill-current" /> : null}
          {state === "checking" ? "Đang chấm…" : state === "recording" ? `Dừng · ${formatElapsed(elapsedSeconds)}` : "Luyện phát âm"}
        </Button>
      </form>

      {state === "recording" ? <p className="px-2 text-xs text-ink-500">Hãy đọc to: “{value}”</p> : null}
      {error ? <p role="alert" className="px-2 text-sm text-danger-text">{error}</p> : null}

      {result && state === "idle" ? (
        <div className="flex flex-col gap-2 rounded-xl bg-surface p-3">
          <div className="flex items-center gap-3">
            <span className={cn("flex size-12 items-center justify-center rounded-full text-lg font-extrabold text-white", result.score >= 90 ? "bg-success-text" : result.score >= 80 ? "bg-score-good" : "bg-score-mid")}>
              {result.score}
            </span>
            <p className="text-sm text-ink-700">
              {result.score >= 90 ? "Phát âm rất tốt!" : result.score >= 80 ? "Khá tốt — chú ý các từ được tô màu." : "Cần luyện thêm — thử đọc chậm hơn nhé."}
            </p>
          </div>
          <p className="flex flex-wrap gap-1.5">
            {result.words.map((word, index) => (
              <span
                key={index}
                className={cn("rounded-full px-2.5 py-1 text-sm font-semibold", word.status === "good" ? "bg-success-bg text-success-text" : "bg-warning-bg text-warning-text")}
              >
                {word.word}
              </span>
            ))}
          </p>
          {isMock ? <p className="text-xs text-ink-400">Kết quả giả lập — chấm phát âm thật sẽ được bổ sung sau.</p> : null}
        </div>
      ) : null}
    </div>
  );
}
