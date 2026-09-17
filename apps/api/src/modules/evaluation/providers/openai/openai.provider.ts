import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { EvaluationOutcome, EvaluationProvider } from "../../evaluation.provider";

@Injectable()
export class OpenAiProvider implements EvaluationProvider {
  readonly name = "openai";
  private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async evaluate(transcript: string, questionText: string): Promise<EvaluationOutcome> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an IELTS Speaking examiner. Score the transcript on the four official IELTS Speaking " +
            "criteria — fluencyCoherence, lexicalResource, grammaticalRange, pronunciation — each on the " +
            "0-9 band scale (0.5 increments allowed), plus an overallBand (0-9). List notable language errors as " +
            "a `corrections` array of {original, corrected, type, explanation}, where type is one of " +
            "'grammar' | 'vocabulary' | 'coherence'. Include a short `summaryFeedback` string. Respond as a " +
            "single JSON object with exactly these fields: fluencyCoherence, lexicalResource, grammaticalRange, " +
            "pronunciation, overallBand, corrections, summaryFeedback.",
        },
        {
          role: "user",
          content: `Question: ${questionText}\n\nTranscript: ${transcript}`,
        },
      ],
    });

    return {
      result: JSON.parse(response.choices[0].message.content ?? "{}"),
      usageTokens: response.usage?.total_tokens,
    };
  }
}
