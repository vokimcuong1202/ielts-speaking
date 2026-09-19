import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { addDays, localDate } from "../../common/utils/local-date";
import { findBottleneck, heatmapIntensity, nextStreak, round1 } from "./progress.rules";

@Injectable()
export class ProgressRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ---------------------------------------------------------------- writes

  /**
   * Rolls one freshly scored attempt into every denormalised progress table
   * (question/topic progress, heatmap day, streak, stats, error stats) in a single transaction.
   */
  async applyScoredAttempt(attemptId: bigint) {
    const attempt = await this.prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        user: { select: { timezone: true } },
        session: { select: { forecastSetId: true } },
        question: { select: { topicGroupId: true } },
        attemptErrors: { select: { errorTypeId: true, wrongText: true, correctText: true } },
      },
    });
    if (!attempt || attempt.status !== "scored" || attempt.bandOverall === null) return;

    const { userId } = attempt;
    const band = attempt.bandOverall.toNumber();
    const now = attempt.scoredAt ?? new Date();
    const today = localDate(attempt.user.timezone, now);
    const durationMs = attempt.durationMs ?? 0;

    await this.prisma.$transaction(async (tx) => {
      // --- per-question progress (15a-15c badges, 13a header)
      const question = await tx.userQuestionProgress.findUnique({
        where: { userId_questionId: { userId, questionId: attempt.questionId } },
      });
      const firstBand = question?.firstBand?.toNumber() ?? band;
      const progressData = {
        attemptsCount: (question?.attemptsCount ?? 0) + 1,
        firstBand,
        lastBand: band,
        bestBand: Math.max(question?.bestBand?.toNumber() ?? band, band),
        bandDelta: round1(band - firstBand),
        lastAttemptId: attempt.id,
        lastPracticedAt: now,
      };
      await tx.userQuestionProgress.upsert({
        where: { userId_questionId: { userId, questionId: attempt.questionId } },
        create: { userId, questionId: attempt.questionId, ...progressData },
        update: progressData,
      });

      // --- heatmap day
      const day = await tx.practiceDay.findUnique({ where: { userId_day: { userId, day: today } } });
      const attemptsCount = (day?.attemptsCount ?? 0) + 1;
      const dayData = {
        attemptsCount,
        speakingMs: (day?.speakingMs ?? 0n) + BigInt(durationMs),
        intensity: heatmapIntensity(attemptsCount),
      };
      await tx.practiceDay.upsert({
        where: { userId_day: { userId, day: today } },
        create: { userId, day: today, ...dayData },
        update: dayData,
      });

      // --- streak
      const streak = await tx.userStreak.findUnique({ where: { userId } });
      const streakData = nextStreak(streak, today);
      await tx.userStreak.upsert({ where: { userId }, create: { userId, ...streakData }, update: streakData });

      // --- topic progress inside the forecast set the session was started from
      const forecastSetId = attempt.session?.forecastSetId;
      const topicGroupId = attempt.question.topicGroupId;
      if (forecastSetId && topicGroupId) {
        const inSet = { topicGroupId, forecastQuestions: { some: { forecastSetId } } };
        const [questionsTotal, answered] = await Promise.all([
          tx.forecastQuestion.count({ where: { forecastSetId, question: { topicGroupId } } }),
          tx.userQuestionProgress.findMany({
            where: { userId, attemptsCount: { gt: 0 }, question: inSet },
            select: { lastBand: true },
          }),
        ]);
        const bands = answered.map((row) => row.lastBand?.toNumber()).filter((value): value is number => value != null);
        const topicData = {
          questionsTotal,
          questionsAnswered: answered.length,
          avgBand: bands.length ? round1(bands.reduce((sum, value) => sum + value, 0) / bands.length) : null,
          lastPracticedAt: now,
        };
        await tx.userTopicProgress.upsert({
          where: { userId_topicGroupId_forecastSetId: { userId, topicGroupId, forecastSetId } },
          create: { userId, topicGroupId, forecastSetId, ...topicData },
          update: topicData,
        });
      }

      // --- recurring mistakes ("Lỗi lặp lại nhiều nhất")
      const errorsByType = new Map<bigint, { count: number; wrong?: string | null; correct?: string | null }>();
      for (const error of attempt.attemptErrors) {
        if (error.errorTypeId === null) continue;
        const entry = errorsByType.get(error.errorTypeId) ?? { count: 0 };
        errorsByType.set(error.errorTypeId, {
          count: entry.count + 1,
          wrong: error.wrongText ?? entry.wrong,
          correct: error.correctText ?? entry.correct,
        });
      }
      for (const [errorTypeId, { count, wrong, correct }] of errorsByType) {
        await tx.userErrorStat.upsert({
          where: { userId_errorTypeId: { userId, errorTypeId } },
          create: { userId, errorTypeId, occurrences: count, sampleWrong: wrong, sampleCorrect: correct, lastSeenAt: now },
          update: {
            occurrences: { increment: count },
            sampleWrong: wrong ?? undefined,
            sampleCorrect: correct ?? undefined,
            lastSeenAt: now,
          },
        });
      }

      // --- headline stats
      const [week, currentSet, recentScores, stats] = await Promise.all([
        tx.practiceDay.aggregate({
          _sum: { speakingMs: true },
          where: { userId, day: { gte: addDays(today, -6) } },
        }),
        tx.forecastSet.findFirst({ where: { isCurrent: true }, select: { id: true } }),
        tx.attemptScore.findMany({
          where: { attempt: { userId, status: "scored" } },
          orderBy: { attempt: { scoredAt: "desc" } },
          take: 80, // ~20 most recent attempts x 4 criteria
        }),
        tx.userStats.findUnique({ where: { userId } }),
      ]);
      const forecastRows = currentSet
        ? await tx.userQuestionProgress.findMany({
            where: {
              userId,
              attemptsCount: { gt: 0 },
              question: { forecastQuestions: { some: { forecastSetId: currentSet.id } } },
            },
            select: { lastBand: true },
          })
        : [];
      const forecastBands = forecastRows.map((row) => row.lastBand?.toNumber()).filter((v): v is number => v != null);
      const bottleneck = findBottleneck(recentScores.map((row) => ({ criterion: row.criterion, band: row.band.toNumber() })));
      const statsData = {
        speakingMsTotal: (stats?.speakingMsTotal ?? 0n) + BigInt(durationMs),
        speakingMsWeek: week._sum.speakingMs ?? 0n,
        forecastDoneCount: forecastRows.length,
        forecastAvgBand: forecastBands.length
          ? round1(forecastBands.reduce((sum, value) => sum + value, 0) / forecastBands.length)
          : null,
        bottleneckCriterion: bottleneck?.criterion ?? null,
        bottleneckNoteVi: bottleneck?.noteVi ?? null,
        refreshedAt: now,
      };
      await tx.userStats.upsert({ where: { userId }, create: { userId, ...statsData }, update: statsData });

      await tx.user.update({ where: { id: userId }, data: { lastActiveAt: now } });
    });
  }

  dismissRecommendation(id: bigint, userId: string) {
    return this.prisma.userRecommendation.updateMany({
      where: { id, userId, dismissedAt: null },
      data: { dismissedAt: new Date() },
    });
  }

  // ----------------------------------------------------------------- reads

  findTimezone(userId: string) {
    return this.prisma.user
      .findUnique({ where: { id: userId }, select: { timezone: true } })
      .then((user) => user?.timezone ?? "Asia/Ho_Chi_Minh");
  }

  findGoal(userId: string) {
    return this.prisma.userGoal.findUnique({ where: { userId } });
  }

  findStreak(userId: string) {
    return this.prisma.userStreak.findUnique({ where: { userId } });
  }

  findStats(userId: string) {
    return this.prisma.userStats.findUnique({ where: { userId } });
  }

  findPracticeDays(userId: string, from: Date, to: Date) {
    return this.prisma.practiceDay.findMany({
      where: { userId, day: { gte: from, lte: to } },
      orderBy: { day: "asc" },
    });
  }

  countDueVocab(userId: string, today: Date) {
    return this.prisma.userVocab.count({
      where: { userId, dueOn: { lte: today }, state: { not: "suspended" } },
    });
  }

  findRecommendations(userId: string, limit: number) {
    return this.prisma.userRecommendation.findMany({
      where: { userId, dismissedAt: null },
      orderBy: { rank: "asc" },
      take: limit,
    });
  }

  findLatestMockTest(userId: string) {
    return this.prisma.mockTest.findFirst({
      where: { userId, status: "scored" },
      orderBy: { takenAt: "desc" },
      select: { id: true, label: true, bandOverall: true, deltaPrev: true, takenAt: true, summaryVi: true },
    });
  }

  findTopErrors(userId: string, limit: number) {
    return this.prisma.userErrorStat.findMany({
      where: { userId },
      orderBy: { occurrences: "desc" },
      take: limit,
      include: { errorType: true },
    });
  }

  /** One point per scored mock test with its four criterion bands (the old v_band_history view). */
  findBandHistory(userId: string) {
    return this.prisma.mockTest.findMany({
      where: { userId, status: "scored" },
      orderBy: { takenAt: "asc" },
      select: {
        id: true,
        takenAt: true,
        bandOverall: true,
        deltaPrev: true,
        mockTestScores: { where: { part: null }, select: { criterion: true, band: true } },
      },
    });
  }
}
