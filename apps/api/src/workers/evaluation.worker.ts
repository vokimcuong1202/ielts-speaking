import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

import { EvaluationService } from "../modules/evaluation/evaluation.service";
import { AttemptsRepository } from "../modules/practice-sessions/attempts.repository";
import { PracticeSessionsService } from "../modules/practice-sessions/practice-sessions.service";
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
    private readonly sessionsService: PracticeSessionsService,
    private readonly quotaService: QuotaService,
  ) {
    super();
  }

  async process(job: Job<EvaluateJobData>) {
    const { attemptId, transcript } = job.data;

    const attempt = await this.attemptsRepository.findByIdWithContext(attemptId);
    if (!attempt) return;

    try {
      const { usageTokens } = await this.evaluationService.evaluateAttempt(
        attemptId,
        transcript,
        attempt.question.text,
      );
      await this.quotaService.recordEvaluationUsage(
        attempt.userId,
        attemptId,
        this.evaluationService.providerName,
        usageTokens,
      );

      await this.sessionsService.finalizeSessionIfComplete(attempt.sessionId);
    } catch (error) {
      await this.attemptsRepository.markFailed(attemptId, (error as Error).message);
      throw error;
    }
  }
}
