import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, Max, Min } from "class-validator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { BigIntId } from "../../common/decorators/bigint-id.decorator";
import { ParseBigIntPipe } from "../../common/pipes/parse-bigint.pipe";
import { VocabularyService } from "./vocabulary.service";
import { VocabularyOverviewService } from "./vocabulary-overview.service";
import { VocabularyTopicDetailService } from "./vocabulary-topic-detail.service";
import { VocabularyOverviewQuery } from "./dto/vocabulary-overview.query";
import { SRS_STATES, SaveVocabBulkDto, SaveVocabDto, SubmitReviewDto, VOCAB_KINDS } from "./dto/vocabulary.dto";

const toNumber = ({ value }: { value: unknown }) => Number(value);

class TopicItemsQuery {
  @IsOptional()
  @Transform(toNumber)
  @IsInt()
  @Min(5)
  @Max(9)
  bandTier?: number;

  @IsOptional()
  @IsIn(VOCAB_KINDS)
  kind?: (typeof VOCAB_KINDS)[number];
}

class NotebookQuery {
  @IsOptional()
  @IsIn(SRS_STATES)
  state?: (typeof SRS_STATES)[number];

  @IsOptional()
  @BigIntId()
  sourceQuestionId?: bigint;
}

class StartReviewBody {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}

@Controller("vocabulary")
@UseGuards(JwtAuthGuard)
export class VocabularyController {
  constructor(
    private readonly vocabularyService: VocabularyService,
    private readonly vocabularyOverviewService: VocabularyOverviewService,
    private readonly vocabularyTopicDetailService: VocabularyTopicDetailService,
  ) {}

  /** Everything the "Sổ từ vựng" page renders (web `VocabularyNotebookData`). */
  @Get("overview")
  overview(@CurrentUser() user: { userId: string }, @Query() query: VocabularyOverviewQuery) {
    return this.vocabularyOverviewService.getOverview(user.userId, query);
  }

  @Get("topics")
  topics() {
    return this.vocabularyService.listTopics();
  }

  /** Everything the topic page renders (web `VocabularyTopicDetail`). */
  @Get("topics/:id/detail")
  topicDetail(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) id: bigint) {
    return this.vocabularyTopicDetailService.getDetail(user.userId, id);
  }

  @Get("topics/:id")
  topic(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseBigIntPipe) id: bigint,
    @Query() query: TopicItemsQuery,
  ) {
    return this.vocabularyService.getTopic(user.userId, id, query);
  }

  @Get("daily")
  daily(@CurrentUser() user: { userId: string }) {
    return this.vocabularyService.getDailyPicks(user.userId);
  }

  @Get("notebook")
  notebook(@CurrentUser() user: { userId: string }, @Query() query: NotebookQuery) {
    return this.vocabularyService.getNotebook(user.userId, query);
  }

  @Post("notebook")
  save(@CurrentUser() user: { userId: string }, @Body() dto: SaveVocabDto) {
    return this.vocabularyService.saveItem(user.userId, dto);
  }

  @Post("notebook/bulk")
  saveBulk(@CurrentUser() user: { userId: string }, @Body() dto: SaveVocabBulkDto) {
    return this.vocabularyService.saveItems(user.userId, dto);
  }

  @Delete("notebook/:id")
  @HttpCode(204)
  remove(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) id: bigint) {
    return this.vocabularyService.removeItem(user.userId, id);
  }

  /** Opens a review session and returns the due cards ("Cần ôn hôm nay"). */
  @Post("review/sessions")
  startReview(@CurrentUser() user: { userId: string }, @Body() body: StartReviewBody) {
    return this.vocabularyService.startReview(user.userId, body.limit ?? 20);
  }

  @Post("review/sessions/:id/reviews")
  submitReview(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseBigIntPipe) sessionId: bigint,
    @Body() dto: SubmitReviewDto,
  ) {
    return this.vocabularyService.submitReview(user.userId, sessionId, dto);
  }

  @Post("review/sessions/:id/finish")
  finishReview(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) sessionId: bigint) {
    return this.vocabularyService.finishReview(user.userId, sessionId);
  }
}
