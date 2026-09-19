import { IsIn, IsInt, IsOptional, IsString, Matches, Min } from "class-validator";

export const IELTS_PARTS = ["part1", "part2", "part3"] as const;
export type IeltsPartValue = (typeof IELTS_PARTS)[number];

export class CreateTopicGroupDto {
  @IsIn(IELTS_PARTS)
  part: IeltsPartValue;

  @Matches(/^[a-z0-9]+(-[a-z0-9]+)*$/, { message: "slug must be kebab-case" })
  slug: string;

  @IsString()
  nameEn: string;

  @IsOptional()
  @IsString()
  nameVi?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
