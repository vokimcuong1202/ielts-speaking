import { IsString, MaxLength, MinLength } from "class-validator";

export class SaveNoteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  body: string;
}

export class TranslateDto {
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  text: string;
}

export class PronunciationCheckDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  text: string;
}
