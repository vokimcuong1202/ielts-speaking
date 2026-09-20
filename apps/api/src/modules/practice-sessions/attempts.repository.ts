import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { AttemptStatus, InvalidReason } from "../../../../../database/generated/client";
import { CreateAttemptDto } from "./dto/create-attempt.dto";
import { EvaluationResult } from "../evaluation/models/evaluation-result.model";

@Injectable()
export class AttemptsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(sessionId: bigint, userId: string, dto: CreateAttemptDto) {
    // A session that belongs to a mock test tags every answer with it (attempts.mock_test_id).
    const [previousAttempts, mockTest] = await Promise.all([
      this.prisma.attempt.count({ where: { userId, questionId: dto.questionId } }),
      this.prisma.mockTest.findFirst({ where: { sessionId, userId }, select: { id: true } }),
    ]);

    return this.prisma.attempt.create({
      data: {
        userId,
        sessionId,
        questionId: dto.questionId,
        mockTestId: mockTest?.id,
        attemptNo: previousAttempts + 1,
        status: AttemptStatus.uploaded,
        audioUrl: dto.audioUrl,
        durationMs: dto.durationMs,
        questionRevealed: dto.questionRevealed ?? false,
      },
    });
  }

  findOwnedId(id: bigint, userId: string) {
    return this.prisma.attempt.findFirst({ where: { id, userId }, select: { id: true } });
  }

  /** One open report per user per attempt: reporting again just updates the reason / note. */
  async reportAttempt(userId: string, attemptId: bigint, data: { reason?: string; note?: string }) {
    const existing = await this.prisma.report.findFirst({
      where: { reporterId: userId, targetKind: "attempt", targetId: attemptId, status: "open" },
    });
    if (existing) return this.prisma.report.update({ where: { id: existing.id }, data });
    return this.prisma.report.create({ data: { reporterId: userId, targetKind: "attempt", targetId: attemptId, ...data } });
  }

  findByIdWithContext(id: bigint) {
    return this.prisma.attempt.findUnique({
      where: { id },
      include: { question: true, session: true },
    });
  }

  /** Full result page payload (13a): scores, error list, rewrite, transcript diff, question progress. */
  findDetailForUser(id: bigint, userId: string) {
    return this.prisma.attempt.findFirst({
      where: { id, userId },
      include: {
        question: { include: { topicGroup: true } },
        attemptScores: true,
        attemptErrors: { orderBy: { seqNo: "asc" }, include: { errorType: true } },
        attemptRewrite: true,
        attemptTranscriptSpans: { orderBy: { charStart: "asc" } },
      },
    });
  }

  setTranscript(id: bigint, data: { transcript: string; wordsPerMin: number | null; fillerCount: number }) {
    return this.prisma.attempt.update({
      where: { id },
      data: { ...data, status: AttemptStatus.grading },
    });
  }

  markInvalid(id: bigint, invalidReason: InvalidReason, transcript?: string) {
    return this.prisma.attempt.update({
      where: { id },
      data: { status: AttemptStatus.invalid, invalidReason, transcript },
    });
  }

  markFailed(id: bigint) {
    return this.prisma.attempt.update({ where: { id }, data: { status: AttemptStatus.failed } });
  }

  /** Persists the whole evaluation and flips the attempt to `scored` atomically. */
  async saveEvaluation(attemptId: bigint, result: EvaluationResult) {
    const slugs = result.errors.map((error) => error.errorTypeSlug).filter((slug): slug is string => !!slug);
    const errorTypes = slugs.length
      ? await this.prisma.errorType.findMany({ where: { slug: { in: slugs } }, select: { id: true, slug: true } })
      : [];
    const errorTypeIdBySlug = new Map(errorTypes.map((type) => [type.slug, type.id]));

    return this.prisma.$transaction(async (tx) => {
      await tx.attemptScore.createMany({
        data: Object.entries(result.criteria).map(([criterion, score]) => ({
          attemptId,
          criterion: criterion as keyof typeof result.criteria,
          band: score.band,
          commentVi: score.commentVi,
        })),
        skipDuplicates: true,
      });

      if (result.errors.length) {
        await tx.attemptError.createMany({
          data: result.errors.map((error, index) => ({
            attemptId,
            seqNo: index + 1,
            errorTypeId: error.errorTypeSlug ? errorTypeIdBySlug.get(error.errorTypeSlug) : undefined,
            atMs: error.atMs,
            wrongText: error.wrongText,
            correctText: error.correctText,
            sentenceEn: error.sentenceEn,
            explanationVi: error.explanationVi,
          })),
          skipDuplicates: true,
        });
      }

      if (result.rewrite) {
        await tx.attemptRewrite.upsert({
          where: { attemptId },
          create: { attemptId, bodyEn: result.rewrite.bodyEn, noteVi: result.rewrite.noteVi },
          update: { bodyEn: result.rewrite.bodyEn, noteVi: result.rewrite.noteVi },
        });
      }

      return tx.attempt.update({
        where: { id: attemptId },
        data: { status: AttemptStatus.scored, bandOverall: result.bandOverall, scoredAt: new Date() },
      });
    });
  }

  findErrorTypeSlugs() {
    return this.prisma.errorType.findMany({ select: { slug: true }, orderBy: { slug: "asc" } });
  }

  countPendingForSession(sessionId: bigint) {
    return this.prisma.attempt.count({
      where: { sessionId, status: { in: [AttemptStatus.recording, AttemptStatus.uploaded, AttemptStatus.grading] } },
    });
  }
}
