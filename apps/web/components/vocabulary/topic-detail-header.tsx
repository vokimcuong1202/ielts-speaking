import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VocabularyTopicDetail } from "@/types/vocabulary";

interface TopicDetailHeaderProps {
  topic: VocabularyTopicDetail;
  onStartReview: () => void;
}

export function TopicDetailHeader({ topic, onStartReview }: TopicDetailHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link
          href="/vocabulary"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          Từ vựng gợi ý
        </Link>
        <h1 className="mt-2 text-2xl font-extrabold text-ink-900 sm:text-3xl">{topic.titleEn}</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          {topic.titleVi} · {topic.totalWords} từ · {topic.masteredWords} đã thuộc · {topic.hotPartsLabel}
        </p>
      </div>

      <Button variant="primary" size="lg" className="shrink-0 rounded-full" onClick={onStartReview}>
        Ôn chủ đề này
      </Button>
    </div>
  );
}
