import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "./infrastructure/database/database.module";
import { QueueModule } from "./infrastructure/queue/queue.module";

import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { TopicGroupsModule } from "./modules/topic-groups/topic-groups.module";
import { PracticeSessionsModule } from "./modules/practice-sessions/practice-sessions.module";
import { AudioModule } from "./modules/audio/audio.module";
import { TranscriptionModule } from "./modules/transcription/transcription.module";
import { EvaluationModule } from "./modules/evaluation/evaluation.module";
import { QuotaModule } from "./modules/quota/quota.module";
import { QuestionsModule } from "./modules/questions/questions.module";
import { ForecastModule } from "./modules/forecast/forecast.module";
import { VocabularyModule } from "./modules/vocabulary/vocabulary.module";
import { MockTestsModule } from "./modules/mock-tests/mock-tests.module";
import { ProgressModule } from "./modules/progress/progress.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { WorkersModule } from "./workers/workers.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    QueueModule,
    AuthModule,
    UsersModule,
    TopicGroupsModule,
    QuestionsModule,
    ForecastModule,
    VocabularyModule,
    MockTestsModule,
    ProgressModule,
    DashboardModule,
    PracticeSessionsModule,
    AudioModule,
    TranscriptionModule,
    EvaluationModule,
    QuotaModule,
    WorkersModule,
  ],
})
export class AppModule {}
