import { IsNumber, IsPositive, IsString } from "class-validator";

export class CreateAttemptDto {
  @IsString()
  questionId: string;

  @IsString()
  rawAudioKey: string;

  @IsNumber()
  @IsPositive()
  durationSeconds: number;
}
