import { Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AttemptBandBadge } from "./attempt-band-badge";
import { ReportMenu } from "./report-menu";
import { AttemptDetail } from "./attempt-detail";
import type { AttemptReportReason, QuestionAttempt } from "@/types/forecast-question";

interface LatestAttemptCardProps {
  attempt: QuestionAttempt;
  onReport: (reason: AttemptReportReason) => Promise<unknown>;
}

export function LatestAttemptCard({ attempt, onReport }: LatestAttemptCardProps) {
  return (
    <Card className="border-brand-200 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-ink-500">
          <button type="button" aria-label="Phát lại" className="flex size-10 items-center justify-center rounded-full border border-brand-500 text-brand-600 hover:bg-brand-50">
            <Play className="size-4 fill-current" />
          </button>
          <span className="tabular-nums">
            Lần {attempt.index} · {attempt.durationLabel} · {attempt.dateLabel}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <AttemptBandBadge attempt={attempt} size={64} />
          {attempt.status === "scored" ? <ReportMenu onReport={onReport} /> : null}
        </div>
      </div>

      <AttemptDetail attempt={attempt} />
    </Card>
  );
}
