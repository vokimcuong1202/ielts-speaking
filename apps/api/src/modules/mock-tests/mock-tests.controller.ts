import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ParseBigIntPipe } from "../../common/pipes/parse-bigint.pipe";
import { MockTestsService } from "./mock-tests.service";
import { CreateMockTestDto } from "./dto/create-mock-test.dto";
import { MockTestHistoryQuery } from "./dto/mock-test-history.query";
import { MockTestHistoryService } from "./mock-test-history.service";

/**
 * Lifecycle: POST /mock-tests -> answer via POST /practice-sessions/:sessionId/attempts
 * -> POST /mock-tests/:id/finish -> poll GET /mock-tests/:id until status is scored/invalidated.
 */
@Controller("mock-tests")
@UseGuards(JwtAuthGuard)
export class MockTestsController {
  constructor(
    private readonly mockTestsService: MockTestsService,
    private readonly historyService: MockTestHistoryService,
  ) {}

  @Post()
  start(@CurrentUser() user: { userId: string }, @Body() dto: CreateMockTestDto) {
    return this.mockTestsService.start(user.userId, dto);
  }

  @Get()
  list(@CurrentUser() user: { userId: string }) {
    return this.mockTestsService.list(user.userId);
  }

  /** "Thi thử" page: activity heatmap + paged history cards (web `TestHistoryData`). Must stay above `:id`. */
  @Get("history")
  history(@CurrentUser() user: { userId: string }, @Query() query: MockTestHistoryQuery) {
    return this.historyService.getHistory(user.userId, query);
  }

  @Get(":id")
  detail(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) id: bigint) {
    return this.mockTestsService.getDetail(user.userId, id);
  }

  @Post(":id/finish")
  finish(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) id: bigint) {
    return this.mockTestsService.finish(user.userId, id);
  }
}
