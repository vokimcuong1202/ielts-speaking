import Link from "next/link";
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
        <Link href="/thi-thu" className="text-sm font-medium text-ink-400 hover:text-ink-700">
          Lịch sử
        </Link>
      </div>

      <div className="mt-8 flex flex-col items-center text-center">
        <p className="mt- 4 text-xs font-semibold uppercase tracking-wide text-ink-400">Band hiện tại</p>
        <p className="mt-4 text-5xl font-extrabold text-brand-800">{score.currentBand?.toFixed(1) ?? "—"}</p>
        {score.previousDelta !== null && (
          <Badge variant="success" size="md" className="mt-3">
            <ChevronUp className="h-3.5 w-3.5" strokeWidth={3} />
            {score.previousDelta.toFixed(1)} so với lần thi trước
          </Badge>
        )}
      </div>

      <Link href="/practice/setup?part=full" className="mt-8">
        <Button variant="primary" size="lg" className="w-full">
          <Headphones className="h-4 w-4" strokeWidth={2} />
          Thi Full Test · {score.fullTestDurationMinutes} phút
        </Button>
      </Link>

    </Card>
  );
}
