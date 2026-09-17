import { IsIn, IsOptional, IsString } from "class-validator";

const SESSION_TYPES = ["part1_drill", "part2_drill", "part3_drill", "mock_test"] as const;

export class CreateSessionDto {
  @IsIn(SESSION_TYPES)
  type: (typeof SESSION_TYPES)[number];

  @IsOptional()
  @IsString()
  topicGroupId?: string;
}
