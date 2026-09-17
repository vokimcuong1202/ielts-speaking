export interface Correction {
  original: string;
  corrected: string;
  type: "grammar" | "vocabulary" | "coherence";
  explanation: string;
}

export interface EvaluationResult {
  fluencyCoherence: number;
  lexicalResource: number;
  grammaticalRange: number;
  pronunciation: number;
  overallBand: number;
  corrections: Correction[];
  summaryFeedback: string;
}
