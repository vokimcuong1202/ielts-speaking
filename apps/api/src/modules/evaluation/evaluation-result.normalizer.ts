import {
  BAND_CRITERIA,
  BandCriterionValue,
  CriterionScore,
  EvaluationError,
  EvaluationResult,
} from "./models/evaluation-result.model";

// attempt_scores / attempts.band_overall have CHECK (band BETWEEN 1 AND 9) and numeric(2,1),
// so raw LLM output must be snapped to the 0.5 grid and clamped before it reaches the DB.
export const snapBand = (value: unknown): number => {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`Invalid band from evaluator: ${String(value)}`);
  return Math.min(9, Math.max(1, Math.round(number * 2) / 2));
};

const optionalString = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

/** Validates untrusted provider JSON into an EvaluationResult. Throws when required fields are missing. */
export function normalizeEvaluationResult(raw: any): EvaluationResult {
  const criteria = {} as Record<BandCriterionValue, CriterionScore>;
  for (const criterion of BAND_CRITERIA) {
    const entry = raw?.criteria?.[criterion];
    if (entry === undefined || entry === null) throw new Error(`Evaluator response is missing criterion "${criterion}"`);
    criteria[criterion] = { band: snapBand(entry.band), commentVi: optionalString(entry.commentVi) };
  }

  const mean = BAND_CRITERIA.reduce((sum, criterion) => sum + criteria[criterion].band, 0) / BAND_CRITERIA.length;
  const errors: EvaluationError[] = (Array.isArray(raw?.errors) ? raw.errors : []).map((error: any) => ({
    errorTypeSlug: optionalString(error?.errorTypeSlug),
    wrongText: optionalString(error?.wrongText),
    correctText: optionalString(error?.correctText),
    sentenceEn: optionalString(error?.sentenceEn),
    explanationVi: optionalString(error?.explanationVi),
    atMs: Number.isInteger(error?.atMs) && error.atMs >= 0 ? error.atMs : undefined,
  }));

  const rewriteBody = optionalString(raw?.rewrite?.bodyEn);

  return {
    // Trust the model's overall band when given, otherwise derive it the IELTS way (mean of four, nearest 0.5).
    bandOverall: raw?.bandOverall !== undefined ? snapBand(raw.bandOverall) : snapBand(mean),
    criteria,
    errors,
    rewrite: rewriteBody ? { bodyEn: rewriteBody, noteVi: optionalString(raw?.rewrite?.noteVi) } : undefined,
  };
}
