import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { AttemptStatus, Prisma } from "../../../../../database/generated/client";
import { CreateAttemptDto } from "./dto/create-attempt.dto";
import { EvaluationResult } from "../evaluation/models/evaluation-result.model";

@Injectable()
export class AttemptsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(sessionId: string, userId: string, dto: CreateAttemptDto) {
    return this.prisma.attempt.create({
      data: {
        sessionId,
        userId,
        questionId: dto.questionId,
        rawAudioKey: dto.rawAudioKey,
        durationSeconds: dto.durationSeconds,
        status: AttemptStatus.pending_scoring,
      },
    });
  }

  findByIdWithContext(id: string) {
    return this.prisma.attempt.findUnique({
      where: { id },
      include: { question: true, session: true },
    });
  }

  setTranscript(id: string, transcript: string) {
    return this.prisma.attempt.update({
      where: { id },
      data: { transcript, status: AttemptStatus.processing },
    });
  }

  markCompleted(id: string) {
    return this.prisma.attempt.update({ where: { id }, data: { status: AttemptStatus.completed } });
  }

  createScore(attemptId: string, score: EvaluationResult) {
    return this.prisma.score.create({
      data: { attemptId, ...score, corrections: score.corrections as unknown as Prisma.InputJsonValue },
    });
  }

  markFailed(id: string, failureReason: string) {
    return this.prisma.attempt.update({
      where: { id },
      data: { status: AttemptStatus.failed, failureReason },
    });
  }

  countPendingForSession(sessionId: string) {
    return this.prisma.attempt.count({
      where: {
        sessionId,
        status: { in: [AttemptStatus.pending_scoring, AttemptStatus.processing] },
      },
    });
  }

  findScoredForSession(sessionId: string) {
    return this.prisma.attempt.findMany({
      where: { sessionId, status: AttemptStatus.completed },
      include: { score: true },
    });
  }
}
