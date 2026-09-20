import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export const ATTEMPT_REPORT_REASONS = ["transcript_wrong", "score_wrong", "audio_problem", "other"] as const;

export class ReportAttemptDto {
  @IsOptional()
  @IsIn(ATTEMPT_REPORT_REASONS)
  reason?: (typeof ATTEMPT_REPORT_REASONS)[number];

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}
