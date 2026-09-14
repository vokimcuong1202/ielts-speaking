export interface EvaluationResult {
  pronunciationScore: number;
  grammarScore: number;
  fluencyScore: number;
  vocabularyScore: number;
  overallScore: number;
  feedback: string;
}
