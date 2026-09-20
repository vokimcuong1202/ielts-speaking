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

  /** Accepts a numeric id or the unique slug the web app uses in its URLs. */
  findForPractice(idOrSlug: string) {
    const where = /^\d+$/.test(idOrSlug) ? { id: BigInt(idOrSlug) } : { slug: idOrSlug };
    return this.prisma.question.findFirst({
      where: { ...where, isActive: true },
      include: {
        topicGroup: true,
        questionIdeaFrames: { orderBy: { stepNo: "asc" } },
        sampleAnswers: { orderBy: { band: "asc" } },
      },
    });
  }

  /**
   * The questions a learner walks through with the prev/next arrows: the follow-ups of the same Part 2
   * cue card for Part 3, otherwise every question of the same part and topic group.
   */
  findSiblings(question: { part: IeltsPart; topicGroupId: bigint | null; parentQuestionId: bigint | null }) {
    return this.prisma.question.findMany({
      where: {
        isActive: true,
        ...(question.parentQuestionId
          ? { parentQuestionId: question.parentQuestionId }
          : { part: question.part, topicGroupId: question.topicGroupId, parentQuestionId: null }),
      },
      orderBy: { id: "asc" },
      select: { id: true, slug: true, textEn: true },
    });
  }

  findPracticeAttempts(userId: string, questionId: bigint) {
    return this.prisma.attempt.findMany({
      where: { userId, questionId },
      orderBy: { attemptNo: "desc" },
      take: 50,
      include: {
        attemptScores: true,
        attemptTranscriptSpans: { orderBy: { charStart: "asc" } },
        attemptRewrite: true,
      },
    });
  }

  findPracticeVocab(questionId: bigint) {
    return this.prisma.questionVocab.findMany({
      where: { questionId },
      orderBy: [{ bandTier: "asc" }, { isCore: "desc" }, { sortOrder: "asc" }],
      include: { vocabItem: true },
    });
  }

  findSavedVocab(userId: string, vocabItemIds: bigint[]) {
    return this.prisma.userVocab.findMany({
      where: { userId, vocabItemId: { in: vocabItemIds } },
      select: { id: true, vocabItemId: true },
    });
  }

  findTimezone(userId: string) {
    return this.prisma.user
      .findUnique({ where: { id: userId }, select: { timezone: true } })
      .then((user) => user?.timezone ?? "Asia/Ho_Chi_Minh");
  }
}
