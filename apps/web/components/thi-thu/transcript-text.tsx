import type { TranscriptSegment } from "@/types/test-history";

export function TranscriptText({ segments }: { segments: TranscriptSegment[] }) {
  return (
    <p className="text-sm leading-relaxed text-ink-700">
      {segments.map((segment, index) => {
        if (segment.kind === "text") {
          return <span key={index}>{segment.content}</span>;
        }

        return (
          <span key={index}>
            {segment.remove ? (
              <span className="text-danger-text line-through decoration-danger-text/60">{segment.remove}</span>
            ) : null}
            {segment.add ? <span className="font-semibold text-brand-700">{segment.remove ? " " : ""}{segment.add}</span> : null}
          </span>
        );
      })}
    </p>
  );
}
