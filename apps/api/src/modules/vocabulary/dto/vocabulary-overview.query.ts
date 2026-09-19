import { Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, Max, Min } from "class-validator";

export const NOTEBOOK_STATUSES = ["all", "needsReview", "mastered"] as const;
export type NotebookStatus = (typeof NOTEBOOK_STATUSES)[number];

export class VocabularyOverviewQuery {
  /** "Tất cả" / "Cần ôn" / "Đã thuộc" filter on the saved words. Default all. */
  @IsOptional()
  @IsIn(NOTEBOOK_STATUSES)
  status?: NotebookStatus;

  /** How many question groups to return; the rest are counted in `remainingGroupsCount`. */
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(50)
  groupLimit?: number;
}
