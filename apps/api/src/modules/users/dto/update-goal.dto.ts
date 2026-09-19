import { IsDateString, IsInt, IsNumber, IsOptional, Max, Min } from "class-validator";

export class UpdateGoalDto {
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(9)
  targetBand: number;

  @IsOptional()
  @IsDateString()
  examDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(21)
  weeklyTargetSessions?: number;
}
