import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { ForecastFlag, IeltsPart, Prisma } from "../../../../../database/generated/client";

export type ForecastSort = "probability" | "appearances" | "newest";

const ORDER_BY: Record<ForecastSort, Prisma.ForecastQuestionOrderByWithRelationInput[]> = {
  probability: [{ probability: { sort: "desc", nulls: "last" } }, { sortOrder: "asc" }],
  appearances: [{ appearances30d: "desc" }, { sortOrder: "asc" }],
  newest: [{ enteredSetOn: { sort: "desc", nulls: "last" } }, { sortOrder: "asc" }],
};

@Injectable()
export class ForecastRepository {
  constructor(private readonly prisma: PrismaService) {}

  findCurrentSet() {
    return this.prisma.forecastSet.findFirst({ where: { isCurrent: true } });
  }

  findSet(id: bigint) {
    return this.prisma.forecastSet.findUnique({ where: { id } });
  }

  findQuestions(
    forecastSetId: bigint,
    filter: { part?: IeltsPart; topicGroupId?: bigint; flag?: ForecastFlag; sort: ForecastSort; limit: number },
  ) {
    return this.prisma.forecastQuestion.findMany({
      where: {
        forecastSetId,
        flag: filter.flag,
        question: { isActive: true, part: filter.part, topicGroupId: filter.topicGroupId },
      },
      orderBy: ORDER_BY[filter.sort],
      take: filter.limit,
      include: {
        question: {
          include: {
            topicGroup: { select: { id: true, slug: true, nameEn: true, nameVi: true } },
            _count: { select: { followUps: true } },
          },
        },
      },
    });
  }

  findProgressFor(userId: string, questionIds: bigint[]) {
    return this.prisma.userQuestionProgress.findMany({ where: { userId, questionId: { in: questionIds } } });
  }

  /** Every question in the set with its topic, used to build per-topic totals. */
  findSetQuestionTopics(forecastSetId: bigint, part?: IeltsPart) {
    return this.prisma.forecastQuestion.findMany({
      where: { forecastSetId, question: { isActive: true, part, topicGroupId: { not: null } } },
      select: { flag: true, question: { select: { topicGroupId: true, topicGroup: true } } },
    });
  }

  findTopicProgress(userId: string, forecastSetId: bigint) {
    return this.prisma.userTopicProgress.findMany({ where: { userId, forecastSetId } });
  }

  /** Every active question in the set with what the Luyện forecast page needs to group and label it. */
  findPracticeQuestions(forecastSetId: bigint) {
    return this.prisma.forecastQuestion.findMany({
      where: { forecastSetId, question: { isActive: true } },
      orderBy: { sortOrder: "asc" },
      include: {
        question: {
          include: {
            topicGroup: { select: { id: true, slug: true, nameEn: true, nameVi: true, sortOrder: true } },
            parent: {
              select: {
                id: true,
                textEn: true,
                topicGroup: { select: { id: true, slug: true, nameEn: true, nameVi: true, sortOrder: true } },
              },
            },
            questionVocab: {
              orderBy: [{ isCore: "desc" }, { bandTier: "desc" }, { sortOrder: "asc" }],
              take: 3,
              select: { vocabItem: { select: { term: true } } },
            },
            followUps: { where: { isActive: true }, orderBy: { id: "asc" }, select: { id: true, textEn: true } },
            _count: { select: { followUps: true } },
          },
        },
      },
    });
  }
}
