import { IsOptional, IsString, IsUrl, Matches, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  displayName?: string;

  @IsOptional()
  @Matches(/^[a-z0-9_]{3,20}$/i, { message: "handle must be 3-20 letters, digits or underscores" })
  handle?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  locale?: string;

  @IsOptional()
  @IsString()
  timezone?: string;
}
