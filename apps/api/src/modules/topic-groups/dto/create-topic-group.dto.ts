import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class CreateQuestionDto {
  @IsIn(["part1", "part2", "part3"])
  part: "part1" | "part2" | "part3";

  @IsString()
  text: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  prepSeconds?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  speakSeconds?: number;
}

export class CreateTopicGroupDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  forecastSeason?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
