import { Injectable } from "@nestjs/common";
import { PronunciationProvider, PronunciationResult } from "../../pronunciation.provider";

const hash = (text: string) => [...text].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);

/**
 * TODO(later): transcribe the audio (the transcription module's Deepgram provider) and align it with the
 * target text, or use a pronunciation-assessment API. This mock ignores the audio and derives a stable,
 * plausible result from the target text, so the flow can be built and demoed end to end.
 */
@Injectable()
export class MockPronunciationProvider implements PronunciationProvider {
  readonly name = "mock";

  async check(_audio: Buffer, _mimeType: string, targetText: string): Promise<PronunciationResult> {
    const score = 74 + (hash(targetText.toLowerCase()) % 23); // 74-96
    const words = targetText.split(/\s+/).filter(Boolean);
    return {
      score,
      transcript: targetText,
      words: words.map((word, index) => ({
        word,
        status: score < 90 && word.replace(/\W/g, "").length >= 6 && (hash(word) + index) % 2 === 0 ? "improve" : "good",
      })),
    };
  }
}
