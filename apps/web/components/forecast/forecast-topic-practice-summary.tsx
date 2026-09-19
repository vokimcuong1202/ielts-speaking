import type { ForecastTopicPracticeSummary } from "@/types/forecast";

export function ForecastTopicPracticeSummaryRow({ summary }: { summary: ForecastTopicPracticeSummary }) {
  return (
    <p className="text-sm text-ink-500">
      Đã trả lời {summary.answeredCount}/{summary.totalCount} câu · {summary.lastPracticedLabel} · điểm thấp nhất ở câu
      &ldquo;{summary.lowestScoreQuestionTitle}&rdquo;
    </p>
  );
}
