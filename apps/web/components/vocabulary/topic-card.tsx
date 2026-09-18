import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { VocabularyTopic } from "@/types/vocabulary";

export function TopicCard({ topic }: { topic: VocabularyTopic }) {
  const ratio = Math.min(1, topic.masteredWords / topic.totalWords);

  return (
    <Card className="p-5">
      <h3 className="text-base font-bold text-ink-900">{topic.titleEn}</h3>
      <p className="mt-0.5 text-sm text-ink-500">{topic.titleVi}</p>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-page">
        <div className="h-full rounded-full bg-brand-600" style={{ width: `${ratio * 100}%` }} />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-xs text-ink-400">
          {topic.totalWords} từ · {topic.masteredWords} thuộc
        </p>
        <Link href={`/vocabulary/${topic.id}`} className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
          Mở →
        </Link>
      </div>
    </Card>
  );
}
