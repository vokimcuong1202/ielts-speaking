import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { ForecastTopicQuestionGrid } from "./forecast-topic-question-grid";
import { ForecastTopicVocabularyFooter } from "./forecast-topic-vocabulary-footer";
import { ForecastTopicPracticeSummaryRow } from "./forecast-topic-practice-summary";
import type { ForecastTopic } from "@/types/forecast";

interface ForecastTopicCardProps {
  topic: ForecastTopic;
  isActive: boolean;
  hideAnswered: boolean;
}

export function ForecastTopicCard({ topic, isActive, hideAnswered }: ForecastTopicCardProps) {
  const newQuestionCount = topic.questions.filter((question) => question.status === "new").length;
  const visibleQuestions = hideAnswered
    ? topic.questions.filter((question) => question.status !== "answered")
    : topic.questions;

  const metaLabel = topic.isNewTopic
    ? `${topic.questions.length} câu · vào bộ ${topic.addedDateLabel}`
    : newQuestionCount > 0
      ? `${topic.questions.length} câu · ${newQuestionCount} câu mới`
      : `${topic.questions.length} câu`;

  return (
    <Card
      id={`forecast-topic-${topic.id}`}
      className={cn("scroll-mt-6 p-5", isActive ? "border-brand-500 bg-brand-50/30" : undefined)}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-extrabold text-ink-900">{topic.name}</h3>
            {topic.isNewTopic ? (
              <Badge variant="brand" size="sm">
                TOPIC MỚI
              </Badge>
            ) : !topic.practiceSummary && topic.hasNewQuestions ? (
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            ) : null}
            {topic.practiceSummary ? (
              <Badge variant="warning" size="sm">
                band gần nhất {topic.practiceSummary.latestBand.toFixed(1)}
              </Badge>
            ) : null}
          </div>

          {topic.practiceSummary ? (
            <div className="mt-1.5">
              <ForecastTopicPracticeSummaryRow summary={topic.practiceSummary} />
            </div>
          ) : (
            <p className="mt-1 text-sm text-ink-400">{metaLabel}</p>
          )}
        </div>

        {topic.practiceSummary ? (
          <Button variant="outline" size="sm" className="shrink-0 rounded-full">
            Xem &amp; nghe lại
          </Button>
        ) : (
          <Button variant="primary" size="sm" className="shrink-0 rounded-full">
            <Play className="h-3.5 w-3.5" strokeWidth={2.5} fill="currentColor" />
            Luyện topic này
          </Button>
        )}
      </div>

      {!topic.practiceSummary ? (
        <div className="mt-4 flex flex-col gap-4">
          <ForecastTopicQuestionGrid questions={visibleQuestions} />
          <ForecastTopicVocabularyFooter words={topic.vocabulary} />
        </div>
      ) : null}
    </Card>
  );
}
