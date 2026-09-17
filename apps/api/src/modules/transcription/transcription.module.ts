import { Module } from "@nestjs/common";
import { TranscriptionService } from "./transcription.service";
import { TRANSCRIPTION_PROVIDER } from "./transcription.provider";
import { DeepgramProvider } from "./providers/deepgram/deepgram.provider";
import { MockTranscriptionProvider } from "./providers/mock/mock.provider";
import { PracticeSessionsModule } from "../practice-sessions/practice-sessions.module";

const SelectedProvider =
  process.env.TRANSCRIPTION_PROVIDER === "mock" ? MockTranscriptionProvider : DeepgramProvider;

@Module({
  imports: [PracticeSessionsModule],
  providers: [
    TranscriptionService,
    SelectedProvider,
    { provide: TRANSCRIPTION_PROVIDER, useExisting: SelectedProvider },
  ],
  exports: [TranscriptionService],
})
export class TranscriptionModule {}
