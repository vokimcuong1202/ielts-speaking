import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";

export const TRANSCRIPTION_QUEUE = "transcription";
export const EVALUATION_QUEUE = "evaluation";

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL,
      },
    }),
    BullModule.registerQueue({ name: TRANSCRIPTION_QUEUE }, { name: EVALUATION_QUEUE }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
