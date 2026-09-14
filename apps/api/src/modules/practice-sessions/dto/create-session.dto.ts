import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateSessionDto {
  @IsString()
  exerciseId: string;

  @IsString()
  audioUrl: string;

  @IsNumber()
  @IsPositive()
  durationSeconds: number;
}
