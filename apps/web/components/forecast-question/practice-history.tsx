"use client";

import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BandBadge } from "@/components/thi-thu/band-badge";
import type { QuestionAttempt } from "@/types/forecast-question";

interface PracticeHistoryProps {
  attempts: QuestionAttempt[];
  onOpen: () => void;
}

/** Summary of past attempts; its button swaps this card and the record prompt for the full attempt list. */
export function PracticeHistory({ attempts, onOpen }: PracticeHistoryProps) {
  const [latest] = attempts;
  const bands = attempts.flatMap((a) => (a.status === "scored" && a.band !== null ? [a.band] : []));
  const best = bands.length ? Math.max(...bands) : null;
  const average = bands.length ? bands.reduce((sum, band) => sum + band, 0) / bands.length : null;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Lịch sử luyện tập</h2>
          <p className="mt-0.5 text-ink-500">
            Đã luyện: <b className="text-brand-700">{attempts.length} lần</b>
            {latest ? ` · gần nhất ${latest.dateLabel}` : null}
          </p>
        </div>
        {best !== null ? (
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-xs font-bold tracking-widest text-ink-400 uppercase">Band cao nhất</p>
              <p className="text-sm text-ink-500">Trung bình {average!.toFixed(1)}</p>
            </div>
            <BandBadge status="completed" band={best} size={64} />
          </div>
        ) : null}
      </div>

      {latest ? (
        <button
          type="button"
          onClick={onOpen}
          className="mt-4 flex w-full cursor-pointer items-center gap-3 border-t border-border pt-4 text-left"
        >
          <span className="font-bold text-brand-700">Xem {attempts.length} lần nói trước</span>
          <span className="flex-1 text-sm text-ink-500">Nghe lại và so sánh tiến bộ</span>
          <span className="flex size-8 items-center justify-center rounded-full border border-border-strong text-ink-500">
            <ChevronDown className="size-4" />
          </span>
        </button>
      ) : null}
    </Card>
  );
}
