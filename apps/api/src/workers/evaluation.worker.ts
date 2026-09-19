import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

import { EvaluationService } from "../modules/evaluation/evaluation.service";
import { AttemptsRepository } from "../modules/practice-sessions/attempts.repository";
import { MockTestsService } from "../modules/mock-tests/mock-tests.service";
import { ProgressService } from "../modules/progress/progress.service";
import { QuotaService } from "../modules/quota/quota.service";
import { EVALUATION_QUEUE } from "../infrastructure/queue/queue.module";

interface EvaluateJobData {
  attemptId: string;
  transcript: string;
}

@Processor(EVALUATION_QUEUE)
export class EvaluationWorker extends WorkerHost {
  constructor(
    private readonly evaluationService: EvaluationService,
    private readonly attemptsRepository: AttemptsRepository,
    private readonly progressService: ProgressService,
    private readonly mockTestsService: MockTestsService,
    private readonly quotaService: QuotaService,
  ) {
    super();
  }

  async process(job: Job<EvaluateJobData>) {
    const attemptId = BigInt(job.data.attemptId);

    const attempt = await this.attemptsRepository.findByIdWithContext(attemptId);
    if (!attempt || attempt.status !== "grading") return; // already scored/failed on an earlier delivery

    try {
      await this.evaluationService.evaluateAttempt(attemptId, job.data.transcript, attempt.question.textEn);
    } catch (error) {
      await this.attemptsRepository.markFailed(attemptId);
      if (attempt.mockTestId) await this.mockTestsService.finalizeIfComplete(attempt.mockTestId);
      throw error;
    }

    // The score is saved; everything below is bookkeeping and must not flip the attempt to failed.
    await this.quotaService.consume(attempt.userId, "ai_scoring");
    await this.progressService.recordScoredAttempt(attemptId);
    if (attempt.mockTestId) await this.mockTestsService.finalizeIfComplete(attempt.mockTestId);
  }
}
