import Link from "next/link";
import { ChevronUp, ClipboardCheck, Headphones } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { getScoreTone, SCORE_TONE_TEXT_CLASS } from "@/lib/score-tone";
import { Button } from "@/components/ui/button";
import type { TestScoreSummary } from "@/types/dashboard";

export function TestScoreCard({ score }: { score: TestScoreSummary }) {
  const progress = Math.min(1, score.fullTestsCompleted / score.fullTestsRequired);

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink-900">Thi thử &amp; band hiện tại</h3>
        <Link href="/thi-thu" className="text-sm font-medium text-ink-400 hover:text-ink-700">
          Lịch sử
        </Link>
      </div>

      {score.currentBand === null ? (
        <div className="mt-6 flex flex-1 flex-col items-center justify-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <ClipboardCheck className="h-7 w-7" strokeWidth={1.75} />
          </span>
          <p className="mt-4 text-base font-bold text-ink-900">Chưa có band hiện tại</p>
          <p className="mt-1.5 max-w-[18rem] text-sm text-ink-500">
            Hoàn thành một bài Full Test để nhận band ước tính và theo dõi tiến bộ của bạn.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Band hiện tại</p>
          <p className={cn("mt-4 text-5xl font-extrabold", SCORE_TONE_TEXT_CLASS[getScoreTone(score.currentBand)])}>
            {score.currentBand.toFixed(1)}
          </p>
          {score.previousDelta !== null && (
            <Badge variant="success" size="md" className="mt-3">
              <ChevronUp className="h-3.5 w-3.5" strokeWidth={3} />
              {score.previousDelta.toFixed(1)} so với lần thi trước
            </Badge>
          )}
        </div>
      )}

      <Link href="/practice/setup?part=full" className="mt-auto pt-6">
        <Button variant="primary" size="lg" className="w-full">
          <Headphones className="h-4 w-4" strokeWidth={2} />
          Thi Full Test · {score.fullTestDurationMinutes} phút
        </Button>
      </Link>

    </Card>
  );
}
