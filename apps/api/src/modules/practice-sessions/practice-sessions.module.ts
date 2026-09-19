import { Module } from "@nestjs/common";
import { AttemptsController, ExaminerVoicesController, PracticeSessionsController } from "./practice-sessions.controller";
import { PracticeSessionsService } from "./practice-sessions.service";
import { PracticeSessionsRepository } from "./practice-sessions.repository";
import { AttemptsRepository } from "./attempts.repository";
import { QuotaModule } from "../quota/quota.module";
import { QueueModule } from "../../infrastructure/queue/queue.module";

@Module({
  imports: [QuotaModule, QueueModule],
  controllers: [PracticeSessionsController, AttemptsController, ExaminerVoicesController],
  providers: [PracticeSessionsService, PracticeSessionsRepository, AttemptsRepository],
  exports: [PracticeSessionsService, PracticeSessionsRepository, AttemptsRepository],
})
export class PracticeSessionsModule {}
