import { IsBoolean, IsOptional } from "class-validator";

export class FinishSessionDto {
  @IsOptional()
  @IsBoolean()
  abandoned?: boolean;
}
