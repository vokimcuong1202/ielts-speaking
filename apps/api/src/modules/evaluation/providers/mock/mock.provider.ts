import { Injectable } from "@nestjs/common";
import { EvaluationProvider } from "../../evaluation.provider";
import { EvaluationResult } from "../../models/evaluation-result.model";

@Injectable()
export class MockEvaluationProvider implements EvaluationProvider {
  readonly name = "mock";

  async evaluate(_transcript: string, _exercisePrompt: string): Promise<EvaluationResult> {
    return {
      pronunciationScore: 80,
      grammarScore: 75,
      fluencyScore: 78,
      vocabularyScore: 82,
      overallScore: 79,
      feedback: "Mock feedback used for local development.",
    };
  }
}
