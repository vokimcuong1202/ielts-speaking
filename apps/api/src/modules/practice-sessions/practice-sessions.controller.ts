import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ParseBigIntPipe } from "../../common/pipes/parse-bigint.pipe";
import { PracticeSessionsService } from "./practice-sessions.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { CreateAttemptDto } from "./dto/create-attempt.dto";
import { FinishSessionDto } from "./dto/finish-session.dto";
import { ReportAttemptDto } from "./dto/report-attempt.dto";

@Controller("practice-sessions")
@UseGuards(JwtAuthGuard)
export class PracticeSessionsController {
  constructor(private readonly sessionsService: PracticeSessionsService) {}

  @Post()
  create(@CurrentUser() user: { userId: string }, @Body() dto: CreateSessionDto) {
    return this.sessionsService.createSession(user.userId, dto);
  }

  @Post(":id/attempts")
  createAttempt(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseBigIntPipe) sessionId: bigint,
    @Body() dto: CreateAttemptDto,
  ) {
    return this.sessionsService.createAttempt(user.userId, sessionId, dto);
  }

  /** Learner is done (or bailed out); stops further attempts on the session. */
  @Patch(":id/finish")
  finish(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseBigIntPipe) sessionId: bigint,
    @Body() dto: FinishSessionDto,
  ) {
    return this.sessionsService.finishSession(user.userId, sessionId, dto.abandoned);
  }

  @Get("history")
  history(@CurrentUser() user: { userId: string }) {
    return this.sessionsService.getHistory(user.userId);
  }

  @Get(":id")
  result(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) id: bigint) {
    return this.sessionsService.getResult(user.userId, id);
  }
}

@Controller("attempts")
@UseGuards(JwtAuthGuard)
export class AttemptsController {
  constructor(private readonly sessionsService: PracticeSessionsService) {}

  @Get(":id")
  detail(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) id: bigint) {
    return this.sessionsService.getAttempt(user.userId, id);
  }

  @Post(":id/reports")
  report(
    @CurrentUser() user: { userId: string },
    @Param("id", ParseBigIntPipe) id: bigint,
    @Body() dto: ReportAttemptDto,
  ) {
    return this.sessionsService.reportAttempt(user.userId, id, dto);
  }
}

@Controller("examiner-voices")
@UseGuards(JwtAuthGuard)
export class ExaminerVoicesController {
  constructor(private readonly sessionsService: PracticeSessionsService) {}

  @Get()
  list() {
    return this.sessionsService.listVoices();
  }
}
