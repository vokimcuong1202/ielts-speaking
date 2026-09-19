import { EvaluationResult } from "./models/evaluation-result.model";

export interface EvaluationOutcome {
  result: EvaluationResult;
  usageTokens?: number;
}

export interface EvaluationProvider {
  readonly name: string;
  /** `errorTypeSlugs` is the catalogue (error_types.slug) the provider should classify errors into. */
  evaluate(transcript: string, questionText: string, errorTypeSlugs: string[]): Promise<EvaluationOutcome>;
}

export const EVALUATION_PROVIDER = Symbol("EVALUATION_PROVIDER");
