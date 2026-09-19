import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { ForecastClusterQuestionGrid } from "./forecast-cluster-question-grid";
import { ForecastClusterPracticeCta } from "./forecast-cluster-practice-cta";
import { ForecastClusterTip } from "./forecast-cluster-tip";
import { ForecastTopicPracticeSummaryRow } from "./forecast-topic-practice-summary";
import type { ForecastFollowUpCluster } from "@/types/forecast";

const DEFAULT_TIP = "Part 3 chấm ý và lập luận — mỗi câu nên có 1 ví dụ cụ thể.";

interface ForecastClusterCardProps {
  cluster: ForecastFollowUpCluster;
  isActive: boolean;
  hideAnswered: boolean;
}

export function ForecastClusterCard({ cluster, isActive, hideAnswered }: ForecastClusterCardProps) {
  if (cluster.practiceSummary) {
    return (
      <Card id={`forecast-cluster-${cluster.id}`} className={cn("scroll-mt-6 p-5", isActive ? "border-brand-500 bg-brand-50/30" : undefined)}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-extrabold text-ink-900">{cluster.sourceTitle}</h3>
              <Badge variant="warning" size="sm">
                band gần nhất {cluster.practiceSummary.latestBand.toFixed(1)}
              </Badge>
            </div>
            <div className="mt-1.5">
              <ForecastTopicPracticeSummaryRow summary={cluster.practiceSummary} />
            </div>
          </div>
          <Button variant="outline" size="sm" className="shrink-0 rounded-full">
            Xem &amp; nghe lại
          </Button>
        </div>
      </Card>
    );
  }

  const visibleQuestions = hideAnswered ? cluster.questions.filter((question) => question.status !== "answered") : cluster.questions;

  const fillerCell = isActive ? (
    <ForecastClusterPracticeCta />
  ) : visibleQuestions.length % 2 === 1 ? (
    <ForecastClusterTip text={cluster.tipText ?? DEFAULT_TIP} />
  ) : null;

  return (
    <Card id={`forecast-cluster-${cluster.id}`} className={cn("scroll-mt-6 p-5", isActive ? "border-brand-500 bg-brand-50/30" : undefined)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" size="sm">
            Nối từ Part 2
          </Badge>
          <h3 className="text-lg font-extrabold text-ink-900">{cluster.sourceTitle}</h3>
        </div>

        {!isActive ? (
          <Button variant="outline" size="sm" className="shrink-0 rounded-full">
            <Play className="h-3.5 w-3.5" strokeWidth={2.5} fill="currentColor" />
            Luyện cả chùm
          </Button>
        ) : null}
      </div>

      <div className="mt-4">
        <ForecastClusterQuestionGrid questions={visibleQuestions} fillerCell={fillerCell} />
      </div>
    </Card>
  );
}
