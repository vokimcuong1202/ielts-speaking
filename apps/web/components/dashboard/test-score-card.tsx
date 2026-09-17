import { ChevronUp, Headphones } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TestScoreSummary } from "@/types/dashboard";

export function TestScoreCard({ score }: { score: TestScoreSummary }) {
  const progress = Math.min(1, score.fullTestsCompleted / score.fullTestsRequired);

  return (
    <Card className="flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink-900">Thi thử &amp; band hiện tại</h3>
        <a href="#" className="text-sm font-medium text-ink-400 hover:text-ink-700">
          Lịch sử
        </a>
      </div>

      <div className="mt-6 flex flex-col items-center text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Band hiện tại</p>
        <p className="mt-1 text-5xl font-extrabold text-brand-800">{score.currentBand.toFixed(1)}</p>
        <Badge variant="success" size="md" className="mt-3">
          <ChevronUp className="h-3.5 w-3.5" strokeWidth={3} />
          {score.previousDelta.toFixed(1)} so với lần thi trước
        </Badge>
      </div>

      <div className="mt-6">
        <p className="text-xs text-ink-500">
          Làm <span className="font-semibold text-ink-700">{score.fullTestsRequired} Full Test</span> để mở khoá
          band dự đoán
        </p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-page">
          <div className="h-full rounded-full bg-brand-600" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <Button variant="primary" size="lg" className="mt-4 w-full">
        <Headphones className="h-4 w-4" strokeWidth={2} />
        Thi Full Test · {score.fullTestDurationMinutes} phút
      </Button>

      <p className="mt-3 text-center text-xs text-ink-400">
        Lần thi gần nhất: {score.lastAttemptDate} · band {score.lastAttemptBand.toFixed(1)}
      </p>
    </Card>
  );
}
