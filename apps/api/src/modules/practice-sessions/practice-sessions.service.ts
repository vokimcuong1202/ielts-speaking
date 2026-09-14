import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

import { PracticeSessionsRepository } from "./practice-sessions.repository";
import { QuotaService } from "../quota/quota.service";
import { CreateSessionDto } from "./dto/create-session.dto";
import { TRANSCRIPTION_QUEUE } from "../../infrastructure/queue/queue.module";

@Injectable()
export class PracticeSessionsService {
  constructor(
    private readonly sessionsRepository: PracticeSessionsRepository,
    private readonly quotaService: QuotaService,
    @InjectQueue(TRANSCRIPTION_QUEUE) private readonly transcriptionQueue: Queue,
  ) {}

  async createSession(userId: string, dto: CreateSessionDto) {
    await this.quotaService.assertHasQuota(userId, dto.durationSeconds);

    const session = await this.sessionsRepository.create(userId, dto);

    // Hands off to the async pipeline: TranscriptionWorker -> EvaluationWorker.
    // Keeping this out of the request/response cycle lets transcription and
    // evaluation take as long as they need, and retry independently on failure.
    await this.transcriptionQueue.add("transcribe", {
      sessionId: session.id,
      userId,
      audioUrl: session.audioUrl,
    });

    return session;
  }

  getResult(sessionId: string) {
    return this.sessionsRepository.findByIdWithResults(sessionId);
  }

  getHistory(userId: string) {
    return this.sessionsRepository.findHistoryForUser(userId);
  }
}
