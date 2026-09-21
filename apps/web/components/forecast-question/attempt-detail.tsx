import { Lightbulb, Play, Sparkles } from "lucide-react";
import { SCORE_TONE_GOOD_MIN } from "@/lib/score-tone";
import { useSpeakWord } from "@/hooks/use-speak-word";
import { cn } from "@/lib/cn";
import { BandBadge } from "@/components/thi-thu/band-badge";
import type { QuestionAttempt } from "@/types/forecast-question";

function HighlightedText({
  text,
  highlight,
}: {
  text: string;
  highlight?: string;
}) {
  if (!highlight) return <>{text}</>;
  const [before, ...rest] = text.split(highlight);
  if (rest.length === 0) return <>{text}</>;
  return (
    <>
      {before}
      <mark className="rounded bg-success-bg/70 px-1 text-inherit">
        {highlight}
      </mark>
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
        isPraise
          ? "border-success-text/30 border-l-success-text bg-success-bg/60"
          : "border-flame/30 border-l-flame bg-flame-bg/60",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-white",
          isPraise ? "bg-success-text" : "bg-flame",
        )}
      >
        <Icon className="size-4" />
      </span>
      <div>
        <p
          className={cn(
            "text-xs font-extrabold tracking-widest",
            isPraise ? "text-success-text" : "text-warning-text",
          )}
        >
          {isPraise ? "LÀM TỐT LẮM" : "LỜI KHUYÊN"}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-ink-900">{tip}</p>
      </div>
    </div>
  );
}

const STATUS_MESSAGE: Record<
  Exclude<QuestionAttempt["status"], "scored">,
  string
> = {
  grading: "AI đang chép lại và chấm bài nói của bạn — thường mất dưới 1 phút.",
  invalid: "Bài nói này không hợp lệ nên không được chấm điểm.",
  failed: "Không chấm được bài nói này. Bạn hãy thử ghi âm lại nhé.",
};

const trimBand = (value: number) => Number(value.toFixed(1));

/** "Đã cải thiện 5.0 → 6.0" card comparing this attempt with the one before it. */
function ProgressCard({
  band,
  previousBand,
  tip,
}: {
  band: number;
  previousBand: number;
  tip: string | null;
}) {
  const delta = trimBand(band - previousBand);
  const label =
    delta > 0 ? "Đã cải thiện" : delta === 0 ? "Giữ vững" : "So với lần trước";
  const headline =
    delta > 0
      ? `Tăng ${delta} band, tiến bộ rõ luôn!`
      : delta === 0
        ? "Giữ vững phong độ nhé!"
        : "Lần này thấp hơn một chút, thử lại nhé!";

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface px-6 py-5 text-center">
      <div className="flex items-center gap-3 text-ink-500">
        <span>{label}</span>
        <BandBadge status="completed" band={previousBand} size={48} />
        <span aria-hidden>→</span>
        <BandBadge status="completed" band={band} size={48} />
      </div>
      <p className="text-lg font-bold text-brand-700">{headline}</p>
      {tip ? <p className="text-sm text-ink-500">{tip}</p> : null}
    </div>
  );
}

/** The feedback part of an expanded attempt: progress vs the previous attempt, the tip and the shortened rewrite. */
export function AttemptDetail({
  attempt,
  previousBand,
}: {
  attempt: QuestionAttempt;
  previousBand: number | null;
}) {
  const { speak, speakingId } = useSpeakWord();

  if (attempt.status !== "scored") {
    return (
      <p className="rounded-xl bg-page px-4 py-3 text-sm text-ink-700">
        {STATUS_MESSAGE[attempt.status]}
      </p>
    );
  }

  const { shortened, band } = attempt;
  const showProgress = band !== null && previousBand !== null;

  return (
    <div className="flex flex-col gap-4">
      {showProgress ? (
        <ProgressCard
          band={band}
          previousBand={previousBand}
          tip={shortened?.tip ?? null}
        />
      ) : null}

      {shortened ? (
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold tracking-widest text-brand-700">
              NÓI NGẮN LẠI
            </span>
            <span className="text-sm text-ink-700">
              Câu ngắn hơn, đúng ngữ pháp hơn — thử nói theo nhé
            </span>
          </div>
          <div className="mt-3 flex gap-3 rounded-2xl border border-border bg-surface p-4">
            <button
              type="button"
              aria-label="Nghe câu mẫu"
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-brand-500 text-brand-600 hover:bg-brand-50"
            >
              <Play className="size-3.5 fill-current" />
            </button>
            <p className="text-base leading-6 text-ink-900">
              <HighlightedText
                text={shortened.text}
                highlight={shortened.highlight}
              />
            </p>
          </div>
          {!showProgress && shortened.tip ? (
            <TipCallout
              tip={shortened.tip}
              isPraise={(band ?? 0) >= SCORE_TONE_GOOD_MIN}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
