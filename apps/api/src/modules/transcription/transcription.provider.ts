export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  durationSeconds: number;
}

export interface TranscriptionProvider {
  readonly name: string;
  transcribe(audioUrl: string): Promise<TranscriptionResult>;
}

export const TRANSCRIPTION_PROVIDER = Symbol("TRANSCRIPTION_PROVIDER");
