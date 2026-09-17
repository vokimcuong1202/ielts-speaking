import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

import { PracticeSessionsRepository } from "./practice-sessions.repository";
import { AttemptsRepository } from "./attempts.repository";
import { QuotaService } from "../quota/quota.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { CreateAttemptDto } from "./dto/create-attempt.dto";
import { TRANSCRIPTION_QUEUE } from "../../infrastructure/queue/queue.module";

const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

@Injectable()
export class PracticeSessionsService {
  constructor(
    private readonly sessionsRepository: PracticeSessionsRepository,
    private readonly attemptsRepository: AttemptsRepository,
    private readonly quotaService: QuotaService,
    @InjectQueue(TRANSCRIPTION_QUEUE) private readonly transcriptionQueue: Queue,
  ) {}

  createSession(userId: string, dto: CreateSessionDto) {
    return this.sessionsRepository.create(userId, dto);
  }

  async createAttempt(userId: string, sessionId: string, dto: CreateAttemptDto) {
    await this.quotaService.assertHasQuota(userId, dto.durationSeconds);

    const attempt = await this.attemptsRepository.create(sessionId, userId, dto);

    // Hands off to the async pipeline: TranscriptionWorker -> EvaluationWorker.
    // Keeping this out of the request/response cycle lets transcription and
    // evaluation take as long as they need, and retry independently on failure.
    await this.transcriptionQueue.add("transcribe", { attemptId: attempt.id });

    return attempt;
  }

  getResult(sessionId: string) {
    return this.sessionsRepository.findByIdWithResults(sessionId);
  }

  getHistory(userId: string) {
    return this.sessionsRepository.findHistoryForUser(userId);
  }

  async finalizeSessionIfComplete(sessionId: string) {
    const pending = await this.attemptsRepository.countPendingForSession(sessionId);
    if (pending > 0) return;

    const scoredAttempts = await this.attemptsRepository.findScoredForSession(sessionId);
    const scores = scoredAttempts
      .map((attempt) => attempt.score)
      .filter((score): score is NonNullable<typeof score> => score !== null);

    if (scores.length === 0) return;

    await this.sessionsRepository.createSessionScore(sessionId, {
      fluencyCoherence: average(scores.map((score) => score.fluencyCoherence.toNumber())),
      lexicalResource: average(scores.map((score) => score.lexicalResource.toNumber())),
      grammaticalRange: average(scores.map((score) => score.grammaticalRange.toNumber())),
      pronunciation: average(scores.map((score) => score.pronunciation.toNumber())),
      overallBand: average(scores.map((score) => score.overallBand.toNumber())),
    });

    await this.sessionsRepository.complete(sessionId);
  }
}
