import { Card } from "@/components/ui/card";
import type { VocabularyTopicOverview } from "@/types/vocabulary";

export function TopicOverviewCard({ overview }: { overview: VocabularyTopicOverview }) {
  const ratio = Math.min(1, overview.masteredCount / overview.totalCount);

  return (
    <Card className="w-full max-w-sm p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-ink-500">Đã thuộc</p>
        <p className="text-lg font-extrabold text-ink-900">
          {overview.masteredCount}
          <span className="text-sm font-medium text-ink-400">/{overview.totalCount}</span>
        </p>
      </div>

      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-page">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${ratio * 100}%` }} />
      </div>

      <p className="mt-3 text-xs text-ink-400">{overview.topicCount} chủ đề · cập nhật theo forecast quý</p>
    </Card>
  );
}
