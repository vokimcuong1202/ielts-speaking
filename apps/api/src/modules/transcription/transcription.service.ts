import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { TRANSCRIPTION_PROVIDER, TranscriptionProvider } from "./transcription.provider";

@Injectable()
export class TranscriptionService {
  constructor(
    @Inject(TRANSCRIPTION_PROVIDER) private readonly provider: TranscriptionProvider,
    private readonly prisma: PrismaService,
  ) {}

  async transcribeSession(sessionId: string, audioUrl: string) {
    const result = await this.provider.transcribe(audioUrl);

    await this.prisma.transcription.create({
      data: {
        sessionId,
        provider: this.provider.name,
        transcript: result.transcript,
        confidence: result.confidence,
      },
    });

    return result;
  }
}
