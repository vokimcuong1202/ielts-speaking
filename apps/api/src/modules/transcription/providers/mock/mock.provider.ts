import { Injectable } from "@nestjs/common";
import { TranscriptionProvider, TranscriptionResult } from "../../transcription.provider";

@Injectable()
export class MockTranscriptionProvider implements TranscriptionProvider {
  readonly name = "mock";

  async transcribe(_audioUrl: string): Promise<TranscriptionResult> {
    return {
      transcript: "This is a mock transcript used for local development.",
      confidence: 0.99,
      durationSeconds: 12,
    };
  }
}
