import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { answerSupportService } from "@/services/answer-support.service";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";

export type PronunciationState = "idle" | "recording" | "checking";

const MAX_SECONDS = 15;

/** Record the learner saying `target`, then score it. `start(text)` begins; call `stop()` (or wait) to submit. */
export function usePronunciationCheck() {
  const { isRecording, start: startRecording, stop: stopRecording } = useAudioRecorder();
  const [target, setTarget] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const check = useMutation({
    mutationFn: ({ audio, text }: { audio: Blob; text: string }) => answerSupportService.checkPronunciation(audio, text),
    onError: () => setError("Không chấm được phát âm, vui lòng thử lại."),
  });
  const { mutate: submit, reset } = check;

  const stop = useCallback(async () => {
    submit({ audio: await stopRecording(), text: target });
  }, [stopRecording, submit, target]);

  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && elapsedSeconds >= MAX_SECONDS) void stop();
  }, [isRecording, elapsedSeconds, stop]);

  const start = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setError(null);
      reset();
      setTarget(trimmed);
      setElapsedSeconds(0);
      try {
        await startRecording();
      } catch (startError) {
        setError(startError instanceof DOMException && startError.name === "NotAllowedError" ? "Hãy cho phép truy cập micro để luyện phát âm." : "Không mở được micro.");
      }
    },
    [reset, startRecording]
  );

  const state: PronunciationState = check.isPending ? "checking" : isRecording ? "recording" : "idle";
  return { state, target, elapsedSeconds, error, result: check.data ?? null, start, stop, clear: reset };
}
