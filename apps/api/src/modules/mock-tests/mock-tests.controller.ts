import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ParseBigIntPipe } from "../../common/pipes/parse-bigint.pipe";
import { MockTestsService } from "./mock-tests.service";
import { CreateMockTestDto } from "./dto/create-mock-test.dto";

/**
 * Lifecycle: POST /mock-tests -> answer via POST /practice-sessions/:sessionId/attempts
 * -> POST /mock-tests/:id/finish -> poll GET /mock-tests/:id until status is scored/invalidated.
 */
@Controller("mock-tests")
@UseGuards(JwtAuthGuard)
export class MockTestsController {
  constructor(private readonly mockTestsService: MockTestsService) {}

  @Post()
  start(@CurrentUser() user: { userId: string }, @Body() dto: CreateMockTestDto) {
    return this.mockTestsService.start(user.userId, dto);
  }

  @Get()
  list(@CurrentUser() user: { userId: string }) {
    return this.mockTestsService.list(user.userId);
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
