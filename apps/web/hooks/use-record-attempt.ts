import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ApiError } from "@/lib/api-client";
import { forecastQuestionService } from "@/services/forecast-question.service";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";

export type RecordState = "idle" | "recording" | "submitting";

const MAX_SECONDS = 120;

function describeError(error: unknown) {
  if (error instanceof ApiError && error.status === 403) return "Bạn đã hết lượt nói hôm nay.";
  if (error instanceof DOMException && error.name === "NotAllowedError") return "Hãy cho phép truy cập micro để ghi âm.";
  return "Không gửi được bản ghi, vui lòng thử lại.";
}

/** Record -> upload -> create attempt. `onSubmitted` fires once the attempt is queued for scoring. */
export function useRecordAttempt(params: { questionId: string; part: string; onSubmitted: () => void }) {
  const { questionId, part, onSubmitted } = params;
  const { isRecording, start, stop } = useAudioRecorder();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(0);

  const submit = useMutation({
    mutationFn: (audio: Blob) =>
      forecastQuestionService.submitRecording({
        questionId,
        part,
        audio,
        durationMs: Math.max(1000, Date.now() - startedAt.current),
      }),
    onSuccess: onSubmitted,
    onError: (submitError) => setError(describeError(submitError)),
  });

  const { mutate: submitAudio } = submit;
  const finish = useCallback(async () => {
    submitAudio(await stop());
  }, [stop, submitAudio]);

  useEffect(() => {
    if (!isRecording) return;
    const timer = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording && elapsedSeconds >= MAX_SECONDS) void finish();
  }, [isRecording, elapsedSeconds, finish]);

  const toggle = useCallback(async () => {
    setError(null);
    if (isRecording) return finish();
    try {
      setElapsedSeconds(0);
      startedAt.current = Date.now();
      await start();
    } catch (startError) {
      setError(describeError(startError));
    }
  }, [finish, isRecording, start]);

  const state: RecordState = submit.isPending ? "submitting" : isRecording ? "recording" : "idle";
  return { state, elapsedSeconds, error, toggle };
}
