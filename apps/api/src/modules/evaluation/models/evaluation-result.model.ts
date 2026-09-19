export const BAND_CRITERIA = ["fluency", "lexical", "grammar", "pronunciation"] as const;
export type BandCriterionValue = (typeof BAND_CRITERIA)[number];

export interface CriterionScore {
  band: number;
  commentVi?: string;
}

/** One finding in the "Lỗi" list; errorTypeSlug is matched against error_types.slug when it exists. */
export interface EvaluationError {
  errorTypeSlug?: string;
  wrongText?: string;
  correctText?: string;
  sentenceEn?: string;
  explanationVi?: string;
  /** offset into the recording, ms */
  atMs?: number;
}

export interface EvaluationRewrite {
  bodyEn: string;
  noteVi?: string;
}

export interface EvaluationResult {
  bandOverall: number;
  criteria: Record<BandCriterionValue, CriterionScore>;
  errors: EvaluationError[];
  rewrite?: EvaluationRewrite;
}
