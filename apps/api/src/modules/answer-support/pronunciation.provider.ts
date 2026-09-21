export interface PronunciationWordResult {
  word: string;
  status: "good" | "improve";
}

export interface PronunciationResult {
  /** 0-100 */
  score: number;
  /** What the recogniser heard the learner say. */
  transcript: string;
  words: PronunciationWordResult[];
}

export interface PronunciationProvider {
  readonly name: string;
  check(audio: Buffer, mimeType: string, targetText: string): Promise<PronunciationResult>;
}

export const PRONUNCIATION_PROVIDER = Symbol("PRONUNCIATION_PROVIDER");
