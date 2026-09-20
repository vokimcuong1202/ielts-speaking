import { Loader2, TriangleAlert } from "lucide-react";
import { BandBadge } from "@/components/thi-thu/band-badge";
import type { QuestionAttempt } from "@/types/forecast-question";

/** The band circle for a scored attempt; a spinner / warning circle while it has no band. */
export function AttemptBandBadge({ attempt, size }: { attempt: QuestionAttempt; size: number }) {
  if (attempt.status === "scored" && attempt.band !== null) {
    return <BandBadge status="completed" band={attempt.band} size={size} />;
  }

  const isGrading = attempt.status === "grading";
  const Icon = isGrading ? Loader2 : TriangleAlert;
  return (
    <div
      role="img"
      aria-label={isGrading ? "Đang chấm điểm" : "Không chấm được"}
      className={
        isGrading
          ? "flex items-center justify-center rounded-full bg-brand-50 text-brand-600"
          : "flex items-center justify-center rounded-full bg-danger-bg text-danger-text"
      }
      style={{ width: size, height: size }}
    >
      <Icon className={isGrading ? "size-1/2 animate-spin" : "size-1/2"} />
    </div>
  );
}
