import { ForecastTopicQuestionItem } from "./forecast-topic-question-item";
import type { ForecastTopicQuestion } from "@/types/forecast";

export function ForecastTopicQuestionGrid({ questions }: { questions: ForecastTopicQuestion[] }) {
  if (questions.length === 0) {
    return <p className="text-sm text-ink-400">Không có câu hỏi phù hợp với bộ lọc hiện tại.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {questions.map((question) => (
        <ForecastTopicQuestionItem key={question.id} question={question} />
      ))}
    </div>
  );
}
