import { EvaluationResult } from "./models/evaluation-result.model";

export interface EvaluationProvider {
  readonly name: string;
  evaluate(transcript: string, exercisePrompt: string): Promise<EvaluationResult>;
}

export const EVALUATION_PROVIDER = Symbol("EVALUATION_PROVIDER");
