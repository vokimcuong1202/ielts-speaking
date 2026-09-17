import { Injectable } from "@nestjs/common";
import { EvaluationOutcome, EvaluationProvider } from "../../evaluation.provider";

@Injectable()
export class MockEvaluationProvider implements EvaluationProvider {
  readonly name = "mock";

  async evaluate(_transcript: string, _questionText: string): Promise<EvaluationOutcome> {
    return {
      result: {
        fluencyCoherence: 6.5,
        lexicalResource: 6.5,
        grammaticalRange: 6.5,
        pronunciation: 6.5,
        overallBand: 6.5,
        corrections: [],
        summaryFeedback: "Mock feedback used for local development.",
      },
    };
  }
}
