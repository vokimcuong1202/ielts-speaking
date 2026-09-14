import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";

import { EvaluationService } from "../modules/evaluation/evaluation.service";
import { PracticeSessionsRepository } from "../modules/practice-sessions/practice-sessions.repository";
import { QuotaService } from "../modules/quota/quota.service";
import { EVALUATION_QUEUE } from "../infrastructure/queue/queue.module";
import { SessionStatus } from "../../../../database/generated/client";

interface EvaluateJobData {
  sessionId: string;
  userId: string;
  transcript: string;
}

@Processor(EVALUATION_QUEUE)
export class EvaluationWorker extends WorkerHost {
  constructor(
    private readonly evaluationService: EvaluationService,
    private readonly sessionsRepository: PracticeSessionsRepository,
    private readonly quotaService: QuotaService,
  ) {
    super();
  }

  async process(job: Job<EvaluateJobData>) {
    const { sessionId, userId, transcript } = job.data;

    await this.sessionsRepository.updateStatus(sessionId, SessionStatus.EVALUATING);

    const session = await this.sessionsRepository.findByIdWithResults(sessionId);
    await this.evaluationService.evaluateSession(sessionId, transcript, session?.exercise.prompt ?? "");
    await this.quotaService.recordEvaluationUsage(userId, sessionId, "openai");

    await this.sessionsRepository.updateStatus(sessionId, SessionStatus.COMPLETED);
  }
}
