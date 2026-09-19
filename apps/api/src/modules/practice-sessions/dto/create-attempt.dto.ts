import { IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";
import { BigIntId } from "../../../common/decorators/bigint-id.decorator";

export class CreateAttemptDto {
  @BigIntId()
  questionId: bigint;

  /** URL returned by POST /audio/upload */
  @IsString()
  audioUrl: string;

  @IsInt()
  @Min(1)
  durationMs: number;

  /** The learner pressed "Hiện câu hỏi" while answering (hidden-question mode). */
  @IsOptional()
  @IsBoolean()
  questionRevealed?: boolean;
}
