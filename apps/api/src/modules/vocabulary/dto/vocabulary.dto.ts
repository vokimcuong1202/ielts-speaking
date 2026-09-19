import { IsIn, IsInt, IsOptional, Max, Min } from "class-validator";
import { BigIntId } from "../../../common/decorators/bigint-id.decorator";

export const VOCAB_SOURCES = ["question_panel", "topic_library", "mock_feedback", "manual", "daily_pick"] as const;
export const SRS_STATES = ["new", "learning", "review", "mastered", "suspended"] as const;
export const SRS_RATINGS = ["again", "hard", "good", "easy"] as const;
export const VOCAB_KINDS = ["word", "collocation", "idiom", "phrasal_verb", "sentence_frame"] as const;

export class SaveVocabDto {
  @BigIntId()
  vocabItemId: bigint;

  @IsOptional()
  @IsIn(VOCAB_SOURCES)
  source?: (typeof VOCAB_SOURCES)[number];

  @IsOptional()
  @BigIntId()
  sourceQuestionId?: bigint;

  @IsOptional()
  @BigIntId()
  sourceAttemptId?: bigint;
}

export class SubmitReviewDto {
  @BigIntId()
  userVocabId: bigint;

  @IsIn(SRS_RATINGS)
  rating: (typeof SRS_RATINGS)[number];

  /** Time the card front was shown before the answer was revealed. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(600_000)
  revealedMs?: number;
}
