import { Processor, WorkerHost, InjectQueue } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";

import { TranscriptionService } from "../modules/transcription/transcription.service";
import { AttemptsRepository } from "../modules/practice-sessions/attempts.repository";
import { MockTestsService } from "../modules/mock-tests/mock-tests.service";
import { EVALUATION_QUEUE, TRANSCRIPTION_QUEUE } from "../infrastructure/queue/queue.module";

interface TranscribeJobData {
  attemptId: string;
}

@Processor(TRANSCRIPTION_QUEUE)
export class TranscriptionWorker extends WorkerHost {
  constructor(
    private readonly transcriptionService: TranscriptionService,
    private readonly attemptsRepository: AttemptsRepository,
    private readonly mockTestsService: MockTestsService,
    @InjectQueue(EVALUATION_QUEUE) private readonly evaluationQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<TranscribeJobData>) {
    const attemptId = BigInt(job.data.attemptId);

    const attempt = await this.attemptsRepository.findByIdWithContext(attemptId);
    if (!attempt || attempt.status !== "uploaded") return; // gone, or already handled on a retry

    try {
      if (!attempt.audioUrl) throw new Error("Attempt has no audio");
      const outcome = await this.transcriptionService.transcribeAttempt(attemptId, attempt.audioUrl, attempt.durationMs);

      if (!outcome.valid) {
        // Invalid answers are terminal; a mock test may now be ready to close out.
        if (attempt.mockTestId) await this.mockTestsService.finalizeIfComplete(attempt.mockTestId);
        return;
      }

      await this.evaluationQueue.add("evaluate", { attemptId: job.data.attemptId, transcript: outcome.transcript });
    } catch (error) {
      await this.attemptsRepository.markFailed(attemptId);
      if (attempt.mockTestId) await this.mockTestsService.finalizeIfComplete(attempt.mockTestId);
      throw error;
    }
  }
}
