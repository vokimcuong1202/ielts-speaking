import { Injectable } from "@nestjs/common";
import { createClient } from "@deepgram/sdk";
import { TranscriptionProvider, TranscriptionResult } from "../../transcription.provider";

@Injectable()
export class DeepgramProvider implements TranscriptionProvider {
  readonly name = "deepgram";
  private readonly client = createClient(process.env.DEEPGRAM_API_KEY);

  async transcribe(audioUrl: string): Promise<TranscriptionResult> {
    const { result } = await this.client.listen.prerecorded.transcribeUrl(
      { url: audioUrl },
      { model: "nova-3", smart_format: true },
    );

    const channel = result?.results?.channels?.[0];
    const alternative = channel?.alternatives?.[0];

    return {
      transcript: alternative?.transcript ?? "",
      confidence: alternative?.confidence ?? 0,
      durationSeconds: result?.metadata?.duration ?? 0,
    };
  }
}
