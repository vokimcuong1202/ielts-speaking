import { Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, Max, Min } from "class-validator";

export const MOCK_TEST_TYPES = ["part1", "part2", "part3", "full"] as const;
export type MockTestType = (typeof MOCK_TEST_TYPES)[number];

export class MockTestHistoryQuery {
  /** Omit for all test types. */
  @IsOptional()
  @IsIn(MOCK_TEST_TYPES)
  type?: MockTestType;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  offset?: number;
}
