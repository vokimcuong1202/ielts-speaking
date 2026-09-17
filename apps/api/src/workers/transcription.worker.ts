import { Processor, WorkerHost, InjectQueue } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";

import { TranscriptionService } from "../modules/transcription/transcription.service";
import { AttemptsRepository } from "../modules/practice-sessions/attempts.repository";
import { QuotaService } from "../modules/quota/quota.service";
import { EVALUATION_QUEUE, TRANSCRIPTION_QUEUE } from "../infrastructure/queue/queue.module";

interface TranscribeJobData {
  attemptId: string;
}

@Processor(TRANSCRIPTION_QUEUE)
export class TranscriptionWorker extends WorkerHost {
  constructor(
    private readonly transcriptionService: TranscriptionService,
    private readonly attemptsRepository: AttemptsRepository,
    private readonly quotaService: QuotaService,
    @InjectQueue(EVALUATION_QUEUE) private readonly evaluationQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<TranscribeJobData>) {
    const { attemptId } = job.data;

    const attempt = await this.attemptsRepository.findByIdWithContext(attemptId);
    if (!attempt) return;

    try {
      const result = await this.transcriptionService.transcribeAttempt(attemptId, attempt.rawAudioKey);
      await this.quotaService.recordTranscriptionUsage(
        attempt.userId,
        attemptId,
        result.durationSeconds,
        this.transcriptionService.providerName,
      );

      await this.evaluationQueue.add("evaluate", { attemptId, transcript: result.transcript });
    } catch (error) {
      await this.attemptsRepository.markFailed(attemptId, (error as Error).message);
      throw error;
    }
  }
}
