import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "./infrastructure/database/database.module";
import { QueueModule } from "./infrastructure/queue/queue.module";

import { AuthModule } from "./modules/auth/auth.module";
import { UsersModule } from "./modules/users/users.module";
import { ExercisesModule } from "./modules/exercises/exercises.module";
import { PracticeSessionsModule } from "./modules/practice-sessions/practice-sessions.module";
import { AudioModule } from "./modules/audio/audio.module";
import { TranscriptionModule } from "./modules/transcription/transcription.module";
import { EvaluationModule } from "./modules/evaluation/evaluation.module";
import { QuotaModule } from "./modules/quota/quota.module";
import { WorkersModule } from "./workers/workers.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    QueueModule,
    AuthModule,
    UsersModule,
    ExercisesModule,
    PracticeSessionsModule,
    AudioModule,
    TranscriptionModule,
    EvaluationModule,
    QuotaModule,
    WorkersModule,
  ],
})
export class AppModule {}
