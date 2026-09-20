import { cn } from "@/lib/cn";
import type { TranscriptSegment } from "@/types/forecast-question";

const segmentClass: Record<TranscriptSegment["kind"], string> = {
  plain: "",
  added: "rounded bg-success-bg/70 px-1",
  removed: "rounded bg-danger-bg px-1 text-danger-text line-through",
};

export function AttemptTranscript({ segments }: { segments: TranscriptSegment[] }) {
  return (
    <p className="text-base leading-6 text-ink-900">
      {segments.map((segment, index) => (
        <span key={index} className={cn(segmentClass[segment.kind])}>
          {segment.text}
        </span>
      ))}
    </p>
  );
}
