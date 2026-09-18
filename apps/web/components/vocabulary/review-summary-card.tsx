import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { VocabularyReviewSummary } from "@/types/vocabulary";

interface ReviewSummaryCardProps {
  reviewSummary: VocabularyReviewSummary;
  onStartReview: () => void;
}

export function ReviewSummaryCard({ reviewSummary, onStartReview }: ReviewSummaryCardProps) {
  return (
    <Card className="w-full max-w-sm p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-ink-500">Cần ôn hôm nay</p>
        <p className="text-lg font-extrabold text-ink-900">{reviewSummary.dueTodayCount}</p>
      </div>

      <Button variant="primary" size="lg" className="mt-3 w-full" onClick={onStartReview}>
        Ôn nhanh {reviewSummary.quickReviewMinutes} phút
      </Button>
    </Card>
  );
}
