import type { EvaluationResult } from "@repo/shared-types";

export function ScoreBreakdown({ evaluation }: { evaluation: EvaluationResult }) {
  return (
    <dl>
      <dt>Pronunciation</dt>
      <dd>{evaluation.pronunciationScore}</dd>
      <dt>Grammar</dt>
      <dd>{evaluation.grammarScore}</dd>
      <dt>Fluency</dt>
      <dd>{evaluation.fluencyScore}</dd>
      <dt>Vocabulary</dt>
      <dd>{evaluation.vocabularyScore}</dd>
      <dt>Overall</dt>
      <dd>{evaluation.overallScore}</dd>
    </dl>
  );
}
