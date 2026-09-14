import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { PracticeSessionsService } from "./practice-sessions.service";
import { CreateSessionDto } from "./dto/create-session.dto";

@Controller("practice-sessions")
@UseGuards(JwtAuthGuard)
export class PracticeSessionsController {
  constructor(private readonly sessionsService: PracticeSessionsService) {}

  @Post()
  create(@CurrentUser() user: { userId: string }, @Body() dto: CreateSessionDto) {
    return this.sessionsService.createSession(user.userId, dto);
  }

  @Get("history")
  history(@CurrentUser() user: { userId: string }) {
    return this.sessionsService.getHistory(user.userId);
  }

  @Get(":id")
  result(@Param("id") id: string) {
    return this.sessionsService.getResult(id);
  }
}
