import type { ReactNode } from "react";
import { ForecastTopicQuestionItem } from "./forecast-topic-question-item";
import type { ForecastFollowUpQuestion } from "@/types/forecast";

interface ForecastClusterQuestionGridProps {
  questions: ForecastFollowUpQuestion[];
  fillerCell?: ReactNode;
}

export function ForecastClusterQuestionGrid({ questions, fillerCell }: ForecastClusterQuestionGridProps) {
  if (questions.length === 0 && !fillerCell) {
    return <p className="text-sm text-ink-400">Không có câu hỏi phù hợp với bộ lọc hiện tại.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {questions.map((question) => (
        <ForecastTopicQuestionItem key={question.id} question={question} />
      ))}
      {fillerCell}
    </div>
  );
}
