import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";

@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { displayName: true, timezone: true, userGoal: true, userStreak: true },
    });
  }

  findScoredAttemptsSince(userId: string, since: Date) {
    return this.prisma.attempt.findMany({
      where: { userId, status: "scored", scoredAt: { gte: since } },
      select: { scoredAt: true, bandOverall: true, question: { select: { part: true } } },
    });
  }

  findLatestScoredMockTests(userId: string, take: number) {
    return this.prisma.mockTest.findMany({
      where: { userId, status: "scored" },
      orderBy: { takenAt: "desc" },
      take,
      select: { bandOverall: true, deltaPrev: true, durationMs: true, takenAt: true },
    });
  }

  countScoredMockTests(userId: string) {
    return this.prisma.mockTest.count({ where: { userId, status: "scored" } });
  }

  findPracticeDays(userId: string, from: Date, to: Date) {
    return this.prisma.practiceDay.findMany({
      where: { userId, day: { gte: from, lte: to } },
      select: { day: true, attemptsCount: true, intensity: true },
    });
  }

  findCurrentForecastSet() {
    return this.prisma.forecastSet.findFirst({ where: { isCurrent: true } });
  }

  findTopForecastQuestions(userId: string, forecastSetId: bigint, take: number) {
    return this.prisma.forecastQuestion.findMany({
      where: { forecastSetId, question: { isActive: true } },
      orderBy: [{ probability: { sort: "desc", nulls: "last" } }, { sortOrder: "asc" }],
      take,
      include: {
        question: {
          include: {
            topicGroup: { select: { nameEn: true } },
            userQuestionProgress: { where: { userId, attemptsCount: { gt: 0 } }, select: { lastBand: true } },
          },
        },
      },
    });
  }
}
