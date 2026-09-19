import { Controller, Get, HttpCode, Param, Post, Query, UseGuards } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ParseBigIntPipe } from "../../common/pipes/parse-bigint.pipe";
import { ProgressService } from "./progress.service";

class HeatmapQuery {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(7)
  @Max(365)
  days?: number;
}

class LimitQuery {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;
}

@Controller("progress")
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get("dashboard")
  dashboard(@CurrentUser() user: { userId: string }) {
    return this.progressService.getDashboard(user.userId);
  }

  @Get("heatmap")
  heatmap(@CurrentUser() user: { userId: string }, @Query() query: HeatmapQuery) {
    return this.progressService.getHeatmap(user.userId, query.days ?? 112);
  }

  @Get("band-history")
  bandHistory(@CurrentUser() user: { userId: string }) {
    return this.progressService.getBandHistory(user.userId);
  }

  @Get("errors")
  errors(@CurrentUser() user: { userId: string }, @Query() query: LimitQuery) {
    return this.progressService.getTopErrors(user.userId, query.limit ?? 5);
  }

  @Post("recommendations/:id/dismiss")
  @HttpCode(204)
  dismiss(@CurrentUser() user: { userId: string }, @Param("id", ParseBigIntPipe) id: bigint) {
    return this.progressService.dismissRecommendation(user.userId, id);
  }
}
