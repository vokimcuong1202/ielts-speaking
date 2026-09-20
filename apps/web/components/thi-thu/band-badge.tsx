import { cn } from "@/lib/cn";
import { ProgressRing } from "@/components/ui/progress-ring";
import { getScoreTone, SCORE_TONE_BG_CLASS } from "@/lib/score-tone";

interface BandBadgeProps {
  band?: number;
  status: "invalid" | "grading" | "completed";
  gradingPercent?: number;
  size?: number;
}

export function BandBadge({ band, status, gradingPercent = 0, size = 56 }: BandBadgeProps) {
  if (status === "invalid") {
    return (
      <div
        className="flex items-center justify-center rounded-full border-2 border-dashed border-danger-border text-danger-text"
        style={{ width: size, height: size }}
      >
        <span className="text-lg font-bold">−</span>
      </div>
    );
  }

  if (status === "grading") {
    return (
      <ProgressRing value={gradingPercent} max={100} size={size} strokeWidth={4} indicatorClassName="stroke-brand-600">
        <span className="text-xs font-bold text-ink-900">{gradingPercent}%</span>
      </ProgressRing>
    );
  }

  const tone = getScoreTone(band ?? 0);

  return (
    <div
      className={cn("flex items-center justify-center rounded-full text-white shadow-sm", SCORE_TONE_BG_CLASS[tone])}
      style={{ width: size, height: size }}
    >
      <span className="font-extrabold leading-none" style={{ fontSize: Math.round(size * 0.43) }}>
        {band?.toFixed(1)}
      </span>
    </div>
  );
}
