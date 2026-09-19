import { Inject, Injectable } from "@nestjs/common";
import { AttemptsRepository } from "../practice-sessions/attempts.repository";
import { TRANSCRIPTION_PROVIDER, TranscriptionProvider } from "./transcription.provider";

// Fewer words than this can't be scored meaningfully -> attempts.invalid_reason = 'too_short'.
const MIN_WORDS = 3;
const FILLER_PATTERN = /\b(?:u+m+|u+h+|e+r+m*|a+h+|h+m+)\b/gi;

export type TranscriptionOutcome =
  | { valid: true; transcript: string; durationMs: number }
  | { valid: false; reason: "no_speech" | "too_short" };

@Injectable()
export class TranscriptionService {
  readonly providerName: string;

  constructor(
    @Inject(TRANSCRIPTION_PROVIDER) private readonly provider: TranscriptionProvider,
    private readonly attemptsRepository: AttemptsRepository,
  ) {
    this.providerName = provider.name;
  }

  /** Transcribes, then either stores the transcript (attempt -> grading) or marks the attempt invalid. */
  async transcribeAttempt(attemptId: bigint, audioUrl: string, clientDurationMs: number | null): Promise<TranscriptionOutcome> {
    const result = await this.provider.transcribe(audioUrl);
    const transcript = result.transcript.trim();
    const wordCount = transcript ? transcript.split(/\s+/).length : 0;

    if (wordCount === 0) {
      await this.attemptsRepository.markInvalid(attemptId, "no_speech");
      return { valid: false, reason: "no_speech" };
    }
    if (wordCount < MIN_WORDS) {
      await this.attemptsRepository.markInvalid(attemptId, "too_short", transcript);
      return { valid: false, reason: "too_short" };
    }

    const durationMs = clientDurationMs ?? Math.round(result.durationSeconds * 1000);
    await this.attemptsRepository.setTranscript(attemptId, {
      transcript,
      wordsPerMin: durationMs > 0 ? Math.round(wordCount / (durationMs / 60_000)) : null,
      fillerCount: transcript.match(FILLER_PATTERN)?.length ?? 0,
    });
    return { valid: true, transcript, durationMs };
  }
}
