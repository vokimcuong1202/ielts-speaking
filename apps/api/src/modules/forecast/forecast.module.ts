import { Module } from "@nestjs/common";
import { ForecastController } from "./forecast.controller";
import { ForecastService } from "./forecast.service";
import { ForecastPracticeService } from "./forecast-practice.service";
import { ForecastRepository } from "./forecast.repository";

@Module({
  controllers: [ForecastController],
  providers: [ForecastService, ForecastPracticeService, ForecastRepository],
  exports: [ForecastService],
})
export class ForecastModule {}
