import { Module } from "@nestjs/common";
import { VocabularyModule } from "../vocabulary/vocabulary.module";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";
import { DashboardRepository } from "./dashboard.repository";

@Module({
  imports: [VocabularyModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
