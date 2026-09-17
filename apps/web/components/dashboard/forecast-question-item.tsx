import { Badge } from "@/components/ui/badge";
import type { ForecastQuestion, ForecastTagVariant } from "@/types/dashboard";

const badgeVariantByTag: Record<ForecastTagVariant, "hot" | "neutral" | "warning"> = {
  hot: "hot",
  neutral: "neutral",
  warning: "warning",
};

export function ForecastQuestionItem({ question }: { question: ForecastQuestion }) {
  return (
    <button
      type="button"
      className="flex flex-col gap-2 rounded-xl border border-border p-4 text-left transition-colors hover:border-brand-300 hover:bg-brand-50/40"
    >
      <div className="flex items-center justify-between">
        <Badge variant={badgeVariantByTag[question.tagVariant]} size="sm">
          {question.tagLabel}
        </Badge>
        <span className="text-xs text-ink-400">{question.part}</span>
      </div>
      <p className="text-sm font-semibold leading-snug text-ink-900">{question.title}</p>
    </button>
  );
}
