import { Processor, WorkerHost, InjectQueue } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";

import { TranscriptionService } from "../modules/transcription/transcription.service";
import { PracticeSessionsRepository } from "../modules/practice-sessions/practice-sessions.repository";
import { QuotaService } from "../modules/quota/quota.service";
import { EVALUATION_QUEUE, TRANSCRIPTION_QUEUE } from "../infrastructure/queue/queue.module";
import { SessionStatus } from "../../../../database/generated/client";

interface TranscribeJobData {
  sessionId: string;
  userId: string;
  audioUrl: string;
}

@Processor(TRANSCRIPTION_QUEUE)
export class TranscriptionWorker extends WorkerHost {
  constructor(
    private readonly transcriptionService: TranscriptionService,
    private readonly sessionsRepository: PracticeSessionsRepository,
    private readonly quotaService: QuotaService,
    @InjectQueue(EVALUATION_QUEUE) private readonly evaluationQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<TranscribeJobData>) {
    const { sessionId, userId, audioUrl } = job.data;

    await this.sessionsRepository.updateStatus(sessionId, SessionStatus.TRANSCRIBING);

    const result = await this.transcriptionService.transcribeSession(sessionId, audioUrl);
    await this.quotaService.recordTranscriptionUsage(userId, sessionId, result.durationSeconds, "deepgram");

    await this.evaluationQueue.add("evaluate", {
      sessionId,
      userId,
      transcript: result.transcript,
    });
  }
}
