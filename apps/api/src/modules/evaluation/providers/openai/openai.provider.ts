import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { EvaluationOutcome, EvaluationProvider } from "../../evaluation.provider";
import { normalizeEvaluationResult } from "../../evaluation-result.normalizer";

@Injectable()
export class OpenAiProvider implements EvaluationProvider {
  readonly name = "openai";
  private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async evaluate(transcript: string, questionText: string, errorTypeSlugs: string[]): Promise<EvaluationOutcome> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an IELTS Speaking examiner coaching a Vietnamese learner. Score the transcript on the four " +
            "official criteria — fluency, lexical, grammar, pronunciation — each on the 1-9 band scale in 0.5 " +
            "steps, and give an overall band (bandOverall). Write every comment/explanation in Vietnamese. " +
            "Respond with a single JSON object shaped exactly like: " +
            '{"bandOverall": number, "criteria": {"fluency": {"band": number, "commentVi": string}, ' +
            '"lexical": {...}, "grammar": {...}, "pronunciation": {...}}, ' +
            '"errors": [{"errorTypeSlug": string, "wrongText": string, "correctText": string, ' +
            '"sentenceEn": string, "explanationVi": string}], ' +
            '"rewrite": {"bodyEn": string, "noteVi": string}}. ' +
            "`errors` lists the most important language mistakes (max 8); errorTypeSlug must be one of: " +
            `${errorTypeSlugs.join(", ") || "(none)"} — omit it if none fits. ` +
            "`rewrite` is a tighter, higher-band version of the answer.",
        },
        {
          role: "user",
          content: `Question: ${questionText}\n\nTranscript: ${transcript}`,
        },
      ],
    });

    return {
      result: normalizeEvaluationResult(JSON.parse(response.choices[0].message.content ?? "{}")),
      usageTokens: response.usage?.total_tokens,
    };
  }
}
