import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { BigIntId } from "../../../common/decorators/bigint-id.decorator";
import { IELTS_PARTS, IeltsPartValue } from "../../topic-groups/dto/create-topic-group.dto";

export const SESSION_MODES = ["practice_question", "practice_topic", "mock_part", "mock_full"] as const;
export type SessionModeValue = (typeof SESSION_MODES)[number];

export class CreateSessionDto {
  @IsIn(SESSION_MODES)
  mode: SessionModeValue;

  /** Omit for mock_full. */
  @IsOptional()
  @IsIn(IELTS_PARTS)
  part?: IeltsPartValue;

  @IsOptional()
  @BigIntId()
  forecastSetId?: bigint;

  @IsOptional()
  @BigIntId()
  topicGroupId?: bigint;

  @IsOptional()
  @IsString()
  voiceCode?: string;

  @IsOptional()
  @IsInt()
  @Min(2)
  @Max(9)
  questionCount?: number;

  @IsOptional()
  @IsBoolean()
  hideQuestion?: boolean;
}
