import { Controller, Delete, Get, Param, Put, Query, UseGuards } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { BigIntId } from "../../common/decorators/bigint-id.decorator";
import { ParseBigIntPipe } from "../../common/pipes/parse-bigint.pipe";
import { IELTS_PARTS, IeltsPartValue } from "../topic-groups/dto/create-topic-group.dto";
import { QuestionsService } from "./questions.service";
import { QuestionPracticeService } from "./question-practice.service";

class ListQuestionsQuery {
  @IsOptional()
  @IsIn(IELTS_PARTS)
  part?: IeltsPartValue;

  @IsOptional()
  @BigIntId()
  topicGroupId?: bigint;

  @IsOptional()
  @BigIntId()
  parentQuestionId?: bigint;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

class QuestionVocabQuery {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(5)
  @Max(9)
  bandTier?: number;
}

@Controller("questions")
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly questionPracticeService: QuestionPracticeService,
  ) {}

  @Get()
  list(@Query() query: ListQuestionsQuery) {
    return this.questionsService.list(query);
  }

  /** Everything the question practice page renders (web `ForecastQuestionPractice`). `:idOrSlug` = id or slug. */
  @Get(":idOrSlug/practice")
  practice(@CurrentUser() user: { userId: string }, @Param("idOrSlug") idOrSlug: string) {
    return this.questionPracticeService.getPractice(user.userId, idOrSlug);
  }

  @Get(":id")
  detail(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) id: bigint) {
    return this.questionsService.getDetail(user.userId, id);
  }

  /** Right-hand "Từ & cụm nên dùng" panel, optionally for one band tab. */
  @Get(":id/vocab")
  vocab(@Param("id", ParseBigIntPipe) id: bigint, @Query() query: QuestionVocabQuery) {
    return this.questionsService.getVocab(id, query.bandTier);
  }

  @Get(":id/attempts")
  myAttempts(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) id: bigint) {
    return this.questionsService.getMyAttempts(user.userId, id);
  }

  @Put(":id/bookmark")
  bookmark(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) id: bigint) {
    return this.questionsService.setBookmark(user.userId, id, true);
  }

  @Delete(":id/bookmark")
  unbookmark(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) id: bigint) {
    return this.questionsService.setBookmark(user.userId, id, false);
  }
}
