import { Module } from "@nestjs/common";
import { PracticeSessionsController } from "./practice-sessions.controller";
import { PracticeSessionsService } from "./practice-sessions.service";
import { PracticeSessionsRepository } from "./practice-sessions.repository";
import { QuotaModule } from "../quota/quota.module";
import { QueueModule } from "../../infrastructure/queue/queue.module";

@Module({
  imports: [QuotaModule, QueueModule],
  controllers: [PracticeSessionsController],
  providers: [PracticeSessionsService, PracticeSessionsRepository],
  exports: [PracticeSessionsService, PracticeSessionsRepository],
})
export class PracticeSessionsModule {}
