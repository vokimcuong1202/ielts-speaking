import { IsIn, IsOptional, IsString, MaxLength } from "class-validator";
import { BigIntId } from "../../../common/decorators/bigint-id.decorator";
import { IELTS_PARTS, IeltsPartValue } from "../../topic-groups/dto/create-topic-group.dto";

export class CreateMockTestDto {
  /** Omit for a full 3-part test. */
  @IsOptional()
  @IsIn(IELTS_PARTS)
  part?: IeltsPartValue;

  @IsOptional()
  @IsString()
  voiceCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  label?: string;

  /** Marks this test as a retake of an earlier one (chuỗi thi lại). */
  @IsOptional()
  @BigIntId()
  retakeOfId?: bigint;
}
