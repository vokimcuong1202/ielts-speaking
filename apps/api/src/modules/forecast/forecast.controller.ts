import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsIn, IsInt, IsOptional, Max, Min } from "class-validator";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { BigIntId } from "../../common/decorators/bigint-id.decorator";
import { IELTS_PARTS, IeltsPartValue } from "../topic-groups/dto/create-topic-group.dto";
import { ForecastService } from "./forecast.service";
import { ForecastPracticeService } from "./forecast-practice.service";
import type { ForecastSort } from "./forecast.repository";

class ForecastQuestionsQuery {
  @IsOptional()
  @IsIn(IELTS_PARTS)
  part?: IeltsPartValue;

  @IsOptional()
  @BigIntId()
  topicGroupId?: bigint;

  @IsOptional()
  @IsIn(["hot", "new", "standard"])
  flag?: "hot" | "new" | "standard";

  @IsOptional()
  @IsIn(["probability", "appearances", "newest"])
  sort?: ForecastSort;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;
}

class ForecastTopicsQuery {
  @IsOptional()
  @IsIn(IELTS_PARTS)
  part?: IeltsPartValue;
}

/** `:setId` is a numeric id or the literal "current". */
@Controller("forecast-sets")
@UseGuards(JwtAuthGuard)
export class ForecastController {
  constructor(
    private readonly forecastService: ForecastService,
    private readonly forecastPracticeService: ForecastPracticeService,
  ) {}

  @Get("current")
  current() {
    return this.forecastService.getCurrentSet();
  }

  /** Everything the "Luyện forecast" page renders (web `ForecastPracticeData`). */
  @Get(":setId/practice")
  async practice(@CurrentUser() user: { userId: string }, @Param("setId") setId: string) {
    const set = await this.forecastService.resolveSet(this.parse(setId));
    return this.forecastPracticeService.getPractice(user.userId, set);
  }

  @Get(":setId/questions")
  async questions(
    @CurrentUser() user: { userId: string },
    @Param("setId") setId: string,
    @Query() query: ForecastQuestionsQuery,
  ) {
    return this.forecastService.listQuestions(user.userId, await this.resolve(setId), query);
  }

  @Get(":setId/topics")
  async topics(
    @CurrentUser() user: { userId: string },
    @Param("setId") setId: string,
    @Query() query: ForecastTopicsQuery,
  ) {
    return this.forecastService.listTopics(user.userId, await this.resolve(setId), query.part);
  }

  private resolve(setId: string) {
    return this.forecastService.resolveSetId(this.parse(setId));
  }

  private parse(setId: string) {
    return setId === "current" ? "current" : BigInt(/^\d+$/.test(setId) ? setId : "0");
  }
}
