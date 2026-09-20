import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

import { PracticeSessionsRepository } from "./practice-sessions.repository";
import { AttemptsRepository } from "./attempts.repository";
import { QuotaService } from "../quota/quota.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { CreateAttemptDto } from "./dto/create-attempt.dto";
import { ReportAttemptDto } from "./dto/report-attempt.dto";
import { TRANSCRIPTION_QUEUE } from "../../infrastructure/queue/queue.module";

@Injectable()
export class PracticeSessionsService {
  constructor(
    private readonly sessionsRepository: PracticeSessionsRepository,
    private readonly attemptsRepository: AttemptsRepository,
    private readonly quotaService: QuotaService,
    @InjectQueue(TRANSCRIPTION_QUEUE) private readonly transcriptionQueue: Queue,
  ) {}

  createSession(userId: string, dto: CreateSessionDto) {
    if (dto.mode === "mock_part" && !dto.part) {
      throw new BadRequestException("part is required for mock_part sessions");
    }
    return this.sessionsRepository.create(userId, dto);
  }

  async createAttempt(userId: string, sessionId: bigint, dto: CreateAttemptDto) {
    const session = await this.sessionsRepository.findOwned(sessionId, userId);
    if (!session) throw new NotFoundException("Session not found");
    if (session.finishedAt) throw new BadRequestException("Session is already finished");

    await this.quotaService.assertHasQuota(userId, "speaking_turn");
    await this.quotaService.assertHasQuota(userId, "ai_scoring");

    const attempt = await this.attemptsRepository.create(sessionId, userId, dto);
    await this.quotaService.consume(userId, "speaking_turn");

    // Hands off to the async pipeline: TranscriptionWorker -> EvaluationWorker.
    // Keeping this out of the request/response cycle lets transcription and
    // evaluation take as long as they need, and retry independently on failure.
    // BullMQ payloads are JSON, so the bigint id travels as a string.
    await this.transcriptionQueue.add("transcribe", { attemptId: attempt.id.toString() });

    return attempt;
  }

  async getAttempt(userId: string, attemptId: bigint) {
    const attempt = await this.attemptsRepository.findDetailForUser(attemptId, userId);
    if (!attempt) throw new NotFoundException("Attempt not found");
    return attempt;
  }

  /** "Báo lỗi" on an attempt card. */
  async reportAttempt(userId: string, attemptId: bigint, dto: ReportAttemptDto) {
    if (!(await this.attemptsRepository.findOwnedId(attemptId, userId))) throw new NotFoundException("Attempt not found");
    return this.attemptsRepository.reportAttempt(userId, attemptId, dto);
  }

  async getResult(userId: string, sessionId: bigint) {
    const session = await this.sessionsRepository.findByIdWithResults(sessionId, userId);
    if (!session) throw new NotFoundException("Session not found");
    return session;
  }

  getHistory(userId: string) {
    return this.sessionsRepository.findHistoryForUser(userId);
  }

  async finishSession(userId: string, sessionId: bigint, abandoned = false) {
    const session = await this.sessionsRepository.findOwned(sessionId, userId);
    if (!session) throw new NotFoundException("Session not found");
    if (session.finishedAt) return session;
    return this.sessionsRepository.finish(sessionId, abandoned);
  }

  listVoices() {
    return this.sessionsRepository.findActiveVoices();
  }
}
