import { Badge } from "@/components/ui/badge";
import type { ForecastTopicQuestion } from "@/types/forecast";

export function ForecastTopicQuestionItem({ question }: { question: ForecastTopicQuestion }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      <p className="text-sm leading-snug font-bold text-ink-900">{question.title}</p>

      <div className="mt-auto flex items-center justify-between gap-2">
        {question.status === "new" ? (
          <Badge variant="brand" size="sm">
            CÂU MỚI
          </Badge>
        ) : question.status === "answered" ? (
          <span className="text-xs text-ink-400">đã trả lời</span>
        ) : (
          <span className="text-xs text-ink-400">chưa trả lời</span>
        )}

        <a href="#" className="shrink-0 text-sm font-semibold text-brand-700 hover:underline">
          Trả lời câu này →
        </a>
      </div>
    </div>
  );
}
