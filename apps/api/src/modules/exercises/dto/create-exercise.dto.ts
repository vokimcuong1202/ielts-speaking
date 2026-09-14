import { IsIn, IsString } from "class-validator";

export class CreateExerciseDto {
  @IsString()
  title: string;

  @IsString()
  prompt: string;

  @IsIn(["beginner", "intermediate", "advanced"])
  difficulty: string;

  @IsString()
  type: string;
}
