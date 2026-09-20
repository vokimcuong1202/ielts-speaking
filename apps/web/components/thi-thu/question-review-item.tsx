import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { BandBadge } from "./band-badge";
import { SkillTagsRow } from "./skill-tags-row";
import { TranscriptText } from "./transcript-text";
import type { QuestionReview } from "@/types/test-history";

export function QuestionReviewItem({ question }: { question: QuestionReview }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        question.isWeakest ? "border-warning-text/20 bg-warning-bg/40" : "border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              {question.isWeakest ? (
                <Badge variant="warning" size="sm" className="mb-1">
                  Câu yếu nhất
                </Badge>
              ) : null}
              <p className="text-sm font-bold text-ink-900">
                Câu {question.index} · {question.question}
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <button
              type="button"
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-500 text-brand-700 hover:bg-brand-50"
            >
              <Play className="ml-0.5 h-3 w-3" fill="currentColor" strokeWidth={0} />
            </button>

            {question.content.kind === "transcript" ? (
              <TranscriptText segments={question.content.segments} />
            ) : (
              <p className="text-sm leading-relaxed text-ink-700">
                <span className="italic">&ldquo;{question.content.quote}&rdquo;</span>{" "}
                <span className="text-ink-500">— {question.content.explanation}</span>
              </p>
            )}
          </div>

          {question.skills ? (
            <div className="mt-3 pl-10">
              <SkillTagsRow skills={question.skills} />
            </div>
          ) : null}

          {question.feedback ? <p className="mt-2 pl-10 text-sm text-ink-600">{question.feedback}</p> : null}
        </div>

        {question.band != null ? (
          <div className="flex shrink-0 flex-col items-center gap-1">
            <a href="#" className="mb-1 text-xs font-semibold text-brand-700 hover:underline">
              Cải thiện câu này →
            </a>
            <BandBadge band={question.band} status="completed" size={66} />
            <a href="#" className="text-xs font-medium text-ink-400 hover:text-ink-700">
              Báo lỗi
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
