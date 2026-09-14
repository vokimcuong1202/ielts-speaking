import { Injectable } from "@nestjs/common";
import OpenAI from "openai";
import { EvaluationProvider } from "../../evaluation.provider";
import { EvaluationResult } from "../../models/evaluation-result.model";

@Injectable()
export class OpenAiProvider implements EvaluationProvider {
  readonly name = "openai";
  private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async evaluate(transcript: string, exercisePrompt: string): Promise<EvaluationResult> {
    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an English speaking examiner. Score the transcript on pronunciation, grammar, fluency, and vocabulary from 0-100, plus an overall score and short feedback. Respond as JSON.",
        },
        {
          role: "user",
          content: `Exercise prompt: ${exercisePrompt}\n\nTranscript: ${transcript}`,
        },
      ],
    });

    return JSON.parse(response.choices[0].message.content ?? "{}");
  }
}
