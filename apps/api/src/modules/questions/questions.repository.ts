import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { IeltsPart } from "../../../../../database/generated/client";

@Injectable()
export class QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(filter: { part?: IeltsPart; topicGroupId?: bigint; parentQuestionId?: bigint; search?: string; limit: number }) {
    return this.prisma.question.findMany({
      where: {
        isActive: true,
        part: filter.part,
        topicGroupId: filter.topicGroupId,
        parentQuestionId: filter.parentQuestionId,
        textEn: filter.search ? { contains: filter.search, mode: "insensitive" } : undefined,
      },
      orderBy: { id: "asc" },
      take: filter.limit,
      include: { topicGroup: true, _count: { select: { followUps: true } } },
    });
  }

  findById(id: bigint) {
    return this.prisma.question.findFirst({
      where: { id, isActive: true },
      include: {
        topicGroup: true,
        parent: { select: { id: true, textEn: true } },
        followUps: { where: { isActive: true }, orderBy: { id: "asc" } },
        questionIdeaFrames: { orderBy: { stepNo: "asc" } },
        sampleAnswers: { orderBy: { band: "asc" } },
      },
    });
  }

  findProgress(userId: string, questionId: bigint) {
    return this.prisma.userQuestionProgress.findUnique({
      where: { userId_questionId: { userId, questionId } },
    });
  }

  findVocab(questionId: bigint, bandTier?: number) {
    return this.prisma.questionVocab.findMany({
      where: { questionId, bandTier },
      orderBy: [{ bandTier: "asc" }, { sortOrder: "asc" }],
      include: { vocabItem: true },
    });
  }

  findAttemptHistory(userId: string, questionId: bigint) {
    return this.prisma.attempt.findMany({
      where: { userId, questionId },
      orderBy: { attemptNo: "desc" },
      select: {
        id: true,
        attemptNo: true,
        status: true,
        durationMs: true,
        bandOverall: true,
        recordedAt: true,
      },
    });
  }

  setBookmark(userId: string, questionId: bigint, isBookmarked: boolean) {
    return this.prisma.userQuestionProgress.upsert({
      where: { userId_questionId: { userId, questionId } },
      create: { userId, questionId, isBookmarked },
      update: { isBookmarked },
    });
  }

  exists(id: bigint) {
    return this.prisma.question.count({ where: { id, isActive: true } }).then((count) => count > 0);
  }
}
