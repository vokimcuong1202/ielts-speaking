import { Module } from "@nestjs/common";

import { QueueModule } from "../infrastructure/queue/queue.module";
import { TranscriptionModule } from "../modules/transcription/transcription.module";
import { EvaluationModule } from "../modules/evaluation/evaluation.module";
import { QuotaModule } from "../modules/quota/quota.module";
import { PracticeSessionsModule } from "../modules/practice-sessions/practice-sessions.module";
import { MockTestsModule } from "../modules/mock-tests/mock-tests.module";
import { ProgressModule } from "../modules/progress/progress.module";

import { TranscriptionWorker } from "./transcription.worker";
import { EvaluationWorker } from "./evaluation.worker";

@Module({
  imports: [
    QueueModule,
    TranscriptionModule,
    EvaluationModule,
    QuotaModule,
    PracticeSessionsModule,
    MockTestsModule,
    ProgressModule,
  ],
  providers: [TranscriptionWorker, EvaluationWorker],
})
export class WorkersModule {}
