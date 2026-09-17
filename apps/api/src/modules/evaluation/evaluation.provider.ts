import { EvaluationResult } from "./models/evaluation-result.model";

export interface EvaluationOutcome {
  result: EvaluationResult;
  usageTokens?: number;
}

export interface EvaluationProvider {
  readonly name: string;
  evaluate(transcript: string, questionText: string): Promise<EvaluationOutcome>;
}

export const EVALUATION_PROVIDER = Symbol("EVALUATION_PROVIDER");
