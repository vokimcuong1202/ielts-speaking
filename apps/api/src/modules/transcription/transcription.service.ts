import { Inject, Injectable } from "@nestjs/common";
import { AttemptsRepository } from "../practice-sessions/attempts.repository";
import { TRANSCRIPTION_PROVIDER, TranscriptionProvider } from "./transcription.provider";

@Injectable()
export class TranscriptionService {
  readonly providerName: string;

  constructor(
    @Inject(TRANSCRIPTION_PROVIDER) private readonly provider: TranscriptionProvider,
    private readonly attemptsRepository: AttemptsRepository,
  ) {
    this.providerName = provider.name;
  }

  async transcribeAttempt(attemptId: string, rawAudioKey: string) {
    const result = await this.provider.transcribe(rawAudioKey);
    await this.attemptsRepository.setTranscript(attemptId, result.transcript);
    return result;
  }
}
