import { Lightbulb, Play, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getScoreTone, SCORE_TONE_BADGE_VARIANT, SCORE_TONE_GOOD_MIN } from "@/lib/score-tone";
import { cn } from "@/lib/cn";
import { AttemptTranscript } from "./attempt-transcript";
import type { QuestionAttempt } from "@/types/forecast-question";

function HighlightedText({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight) return <>{text}</>;
  const [before, ...rest] = text.split(highlight);
  if (rest.length === 0) return <>{text}</>;
  return (
    <>
      {before}
      <mark className="rounded bg-success-bg/70 px-1 text-inherit">{highlight}</mark>
      {rest.join(highlight)}
    </>
  );
}

function TipCallout({ tip, isPraise }: { tip: string; isPraise: boolean }) {
  const Icon = isPraise ? Sparkles : Lightbulb;
  return (
    <div
      className={cn(
        "mt-3 flex items-start gap-3 rounded-xl border border-l-4 p-3",
        isPraise ? "border-success-text/30 border-l-success-text bg-success-bg/60" : "border-flame/30 border-l-flame bg-flame-bg/60"
      )}
    >
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full text-white", isPraise ? "bg-success-text" : "bg-flame")}>
        <Icon className="size-4" />
      </span>
      <div>
        <p className={cn("text-xs font-extrabold tracking-widest", isPraise ? "text-success-text" : "text-warning-text")}>
          {isPraise ? "LÀM TỐT LẮM" : "LỜI KHUYÊN"}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-ink-900">{tip}</p>
      </div>
    </div>
  );
}

const STATUS_MESSAGE: Record<Exclude<QuestionAttempt["status"], "scored">, string> = {
  grading: "AI đang chép lại và chấm bài nói của bạn — thường mất dưới 1 phút.",
  invalid: "Bài nói này không hợp lệ nên không được chấm điểm.",
  failed: "Không chấm được bài nói này. Bạn hãy thử ghi âm lại nhé.",
};

export function AttemptDetail({ attempt }: { attempt: QuestionAttempt }) {
  if (attempt.status !== "scored") {
    return <p className="mt-4 rounded-xl bg-page px-4 py-3 text-sm text-ink-700">{STATUS_MESSAGE[attempt.status]}</p>;
  }

  return (
    <>
    <div className="mt-4">
      <AttemptTranscript segments={attempt.transcript} />
    </div>

    <div className="mt-3 flex flex-wrap gap-1.5">
      {attempt.skills.map((skill) => (
        <Badge key={skill.id} variant={SCORE_TONE_BADGE_VARIANT[getScoreTone(skill.score)]} size="md">
          {skill.label}: {skill.score}
        </Badge>
      ))}
    </div>

    {attempt.shortened ? (
      <div className="mt-4 border-t border-border pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold tracking-widest text-brand-700">NÓI NGẮN LẠI</span>
          <span className="text-sm text-ink-700">Câu ngắn hơn, đúng ngữ pháp hơn — thử nói theo nhé</span>
        </div>
        <div className="mt-3 flex gap-3 rounded-2xl border border-border p-4">
          <button type="button" aria-label="Nghe câu mẫu" className="flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-500 text-brand-600 hover:bg-brand-50">
            <Play className="size-3.5 fill-current" />
          </button>
          <p className="text-base leading-6 text-ink-900">
            <HighlightedText text={attempt.shortened.text} highlight={attempt.shortened.highlight} />
          </p>
        </div>
        {attempt.shortened.tip ? <TipCallout tip={attempt.shortened.tip} isPraise={(attempt.band ?? 0) >= SCORE_TONE_GOOD_MIN} /> : null}
      </div>
    ) : null}

    <div className="mt-4 flex flex-wrap items-center gap-5 text-sm font-semibold text-brand-700">
      <button type="button" className="hover:underline">Mở rộng ý tưởng</button>
      <button type="button" className="hover:underline">Shadowing câu này</button>
      <button type="button" className="hover:underline">Cải thiện câu</button>
      <button type="button" className="ml-auto font-normal text-ink-400 hover:text-ink-700">Chia sẻ ↗</button>
    </div>
    </>
  );
}
