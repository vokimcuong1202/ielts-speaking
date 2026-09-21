import { Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { RecordState } from "@/hooks/use-record-attempt";

const BAR_DELAYS = [0, 0.25, 0.1, 0.4, 0.15, 0.35, 0.05, 0.3, 0.2];

const formatElapsed = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

interface RecordPromptProps {
  state: RecordState;
  elapsedSeconds: number;
}

export function RecordPrompt({ state, elapsedSeconds }: RecordPromptProps) {
  const isRecording = state === "recording";

  return (
    <Card className={cn("flex min-h-[240px] flex-1 flex-col items-center justify-center gap-4 p-8 text-center transition-colors", isRecording && "border-danger-text/40")}>
      <span className="relative flex size-24 items-center justify-center">
        {isRecording
          ? [0, 0.6].map((delay) => (
              <span
                key={delay}
                aria-hidden
                className="record-anim absolute inset-0 rounded-full bg-danger-text/25"
                style={{ animation: `mic-ring 1.8s ease-out ${delay}s infinite` }}
              />
            ))
          : null}
        <span
          className={cn(
            "record-anim relative flex size-full items-center justify-center rounded-full border transition-colors",
            isRecording ? "border-danger-text/40 bg-danger-bg text-danger-text" : "border-brand-200 bg-brand-50 text-brand-600"
          )}
          style={isRecording ? { animation: "mic-breathe 1.4s ease-in-out infinite" } : undefined}
        >
          <Mic className="size-9" strokeWidth={1.75} />
        </span>
      </span>

      {isRecording ? (
        <>
          <div aria-hidden className="flex h-8 items-center gap-1">
            {BAR_DELAYS.map((delay, i) => (
              <span
                key={i}
                className="record-anim h-full w-1 origin-center rounded-full bg-danger-text/70"
                style={{ animation: `sound-bar 0.9s ease-in-out ${delay}s infinite` }}
              />
            ))}
          </div>
          <p role="status" className="text-lg font-bold text-ink-900">
            Đang ghi âm… <span className="tabular-nums text-danger-text">{formatElapsed(elapsedSeconds)}</span>
          </p>
          <p className="text-sm text-ink-500">Nói tự nhiên, bấm “Dừng” khi bạn trả lời xong.</p>
        </>
      ) : (
        <p className="text-lg font-bold text-ink-900">
          Nhấn nút <span className="text-brand-600">Ghi âm ngay</span> ở dưới để trả lời câu hỏi
        </p>
      )}
    </Card>
  );
}
