import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { BandCriterion, IeltsPart, InvalidReason } from "../../../../../database/generated/client";
import { CreateMockTestDto } from "./dto/create-mock-test.dto";

export interface MockScoreRow {
  part: IeltsPart | null;
  criterion: BandCriterion;
  band: number;
}

@Injectable()
export class MockTestsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** A mock test owns a practice session; answers are recorded against the session. */
  create(userId: string, dto: CreateMockTestDto) {
    return this.prisma.$transaction(async (tx) => {
      const session = await tx.practiceSession.create({
        data: {
          userId,
          mode: dto.part ? "mock_part" : "mock_full",
          part: dto.part,
          voiceCode: dto.voiceCode,
          hideQuestion: false,
        },
      });
      return tx.mockTest.create({
        data: {
          userId,
          sessionId: session.id,
          label: dto.label ?? (dto.part ? `Mock ${dto.part}` : "Full Test"),
          voiceCode: dto.voiceCode,
          retakeOfId: dto.retakeOfId,
        },
      });
    });
  }

  findUserTimezone(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
  }

  /** Light rows for the whole history: filtering, retake chains, heatmap and counts are derived from these. */
  listHistoryIndex(userId: string) {
    return this.prisma.mockTest.findMany({
      where: { userId },
      orderBy: { takenAt: "desc" },
      select: {
        id: true,
        status: true,
        bandOverall: true,
        retakeOfId: true,
        takenAt: true,
        session: { select: { mode: true, part: true } },
      },
    });
  }

  findHistoryDetails(userId: string, ids: bigint[]) {
    return this.prisma.mockTest.findMany({
      where: { userId, id: { in: ids } },
      orderBy: { takenAt: "desc" },
      include: {
        examinerVoice: { select: { name: true } },
        mockTestScores: { where: { part: null } },
        attempts: {
          orderBy: { recordedAt: "asc" },
          include: {
            question: { select: { part: true, textEn: true } },
            attemptScores: true,
            attemptTranscriptSpans: { orderBy: { charStart: "asc" } },
          },
        },
      },
    });
  }

  findOwnedRetakeTarget(id: bigint, userId: string) {
    return this.prisma.mockTest.findFirst({ where: { id, userId }, select: { id: true } });
  }

  list(userId: string) {
    return this.prisma.mockTest.findMany({
      where: { userId },
      orderBy: { takenAt: "desc" },
      include: { mockTestScores: { where: { part: null } } },
    });
  }

  findDetail(id: bigint, userId: string) {
    return this.prisma.mockTest.findFirst({
      where: { id, userId },
      include: {
        mockTestScores: { orderBy: [{ part: "asc" }, { criterion: "asc" }] },
        retakes: { select: { id: true, bandOverall: true, takenAt: true }, orderBy: { takenAt: "asc" } },
        attempts: {
          orderBy: { recordedAt: "asc" },
          include: { question: { select: { id: true, part: true, textEn: true } }, attemptScores: true },
        },
      },
    });
  }

  findOwned(id: bigint, userId: string) {
    return this.prisma.mockTest.findFirst({ where: { id, userId } });
  }

  /** Learner submitted everything: stop accepting answers and wait for grading. */
  async markGrading(id: bigint, sessionId: bigint | null, durationMs: number) {
    await this.prisma.$transaction([
      this.prisma.mockTest.update({ where: { id }, data: { status: "grading", durationMs } }),
      ...(sessionId
        ? [this.prisma.practiceSession.update({ where: { id: sessionId }, data: { finishedAt: new Date() } })]
        : []),
    ]);
  }

  findForFinalize(id: bigint) {
    return this.prisma.mockTest.findUnique({
      where: { id },
      include: {
        attempts: {
          select: {
            status: true,
            invalidReason: true,
            question: { select: { part: true } },
            attemptScores: { select: { criterion: true, band: true } },
          },
        },
      },
    });
  }

  findPreviousScored(userId: string, before: Date) {
    return this.prisma.mockTest.findFirst({
      where: { userId, status: "scored", takenAt: { lt: before } },
      orderBy: { takenAt: "desc" },
      select: { bandOverall: true },
    });
  }

  /** Claims the grading -> scored/invalidated transition so concurrent workers can't both finalize. */
  async markInvalidated(id: bigint, invalidReason: InvalidReason) {
    const { count } = await this.prisma.mockTest.updateMany({
      where: { id, status: "grading" },
      data: { status: "invalidated", invalidReason, scoredAt: new Date() },
    });
    return count === 1;
  }

  async saveScored(
    mock: { id: bigint; userId: string },
    result: { bandOverall: number; deltaPrev: number | null; scores: MockScoreRow[] },
  ) {
    return this.prisma.$transaction(async (tx) => {
      const { count } = await tx.mockTest.updateMany({
        where: { id: mock.id, status: "grading" },
        data: {
          status: "scored",
          bandOverall: result.bandOverall,
          deltaPrev: result.deltaPrev,
          scoredAt: new Date(),
        },
      });
      if (count === 0) return false;

      await tx.mockTestScore.createMany({
        data: result.scores.map((score) => ({ mockTestId: mock.id, ...score })),
      });

      const stats = await tx.userStats.findUnique({ where: { userId: mock.userId } });
      await tx.userStats.upsert({
        where: { userId: mock.userId },
        create: {
          userId: mock.userId,
          latestBand: result.bandOverall,
          firstBand: result.bandOverall,
          mockTestsCount: 1,
        },
        update: {
          latestBand: result.bandOverall,
          firstBand: stats?.firstBand ?? result.bandOverall,
          mockTestsCount: { increment: 1 },
        },
      });
      return true;
    });
  }
}
