import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { Prisma, SrsRating, SrsState, VocabKind, VocabSource } from "../../../../../database/generated/client";
import { SrsResult } from "./srs";

@Injectable()
export class VocabularyRepository {
  constructor(private readonly prisma: PrismaService) {}

  findTimezone(userId: string) {
    return this.prisma.user
      .findUnique({ where: { id: userId }, select: { timezone: true } })
      .then((user) => user?.timezone ?? "Asia/Ho_Chi_Minh");
  }

  // ------------------------------------------------------------ topic library

  findTopics() {
    return this.prisma.vocabTopic.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { vocabItems: true } } },
    });
  }

  findTopicWithItems(id: bigint, filter: { bandTier?: number; kind?: VocabKind }) {
    return this.prisma.vocabTopic.findUnique({
      where: { id },
      include: {
        vocabItems: {
          where: { bandTier: filter.bandTier, kind: filter.kind },
          orderBy: [{ bandTier: "asc" }, { term: "asc" }],
        },
      },
    });
  }

  findSavedItemIds(userId: string, vocabItemIds: bigint[]) {
    return this.prisma.userVocab.findMany({
      where: { userId, vocabItemId: { in: vocabItemIds } },
      select: { id: true, vocabItemId: true, state: true },
    });
  }

  // ---------------------------------------------------------------- daily picks

  findDailyPicks(userId: string, pickDate: Date) {
    return this.prisma.dailyVocabPick.findMany({
      where: { userId, pickDate },
      orderBy: [{ isHero: "desc" }, { sortOrder: "asc" }],
      include: { vocabItem: { include: { vocabTopic: true } } },
    });
  }

  findUnsavedItems(userId: string, take: number) {
    return this.prisma.vocabItem.findMany({
      where: { userVocab: { none: { userId } } },
      orderBy: { id: "asc" },
      take,
    });
  }

  async createDailyPicks(userId: string, pickDate: Date, itemIds: bigint[]) {
    await this.prisma.dailyVocabPick.createMany({
      data: itemIds.map((vocabItemId, index) => ({
        userId,
        pickDate,
        vocabItemId,
        isHero: index === 0,
        sortOrder: index,
      })),
      skipDuplicates: true, // two tabs opening the home page at once
    });
  }

  // ------------------------------------------------------------------ notebook

  findNotebook(userId: string, filter: { state?: SrsState; sourceQuestionId?: bigint }) {
    return this.prisma.userVocab.findMany({
      where: { userId, state: filter.state, sourceQuestionId: filter.sourceQuestionId },
      orderBy: { savedAt: "desc" },
      include: {
        vocabItem: true,
        question: { select: { id: true, textEn: true } },
      },
    });
  }

  /** Whole notebook for the "Sổ từ vựng" page, newest first. */
  findNotebookEntries(userId: string) {
    return this.prisma.userVocab.findMany({
      where: { userId },
      orderBy: { savedAt: "desc" },
      include: {
        vocabItem: true,
        question: { select: { id: true, textEn: true, part: true } },
      },
    });
  }

  countDue(userId: string, today: Date) {
    return this.prisma.userVocab.count({ where: { userId, dueOn: { lte: today }, state: { not: "suspended" } } });
  }

  save(userId: string, data: { vocabItemId: bigint; source: VocabSource; sourceQuestionId?: bigint; sourceAttemptId?: bigint }) {
    return this.prisma.userVocab.upsert({
      where: { userId_vocabItemId: { userId, vocabItemId: data.vocabItemId } },
      create: { userId, ...data },
      update: {}, // already in the notebook: keep its SRS progress
      include: { vocabItem: true },
    });
  }

  remove(id: bigint, userId: string) {
    return this.prisma.userVocab.deleteMany({ where: { id, userId } });
  }

  itemExists(id: bigint) {
    return this.prisma.vocabItem.count({ where: { id } }).then((count) => count > 0);
  }

  // -------------------------------------------------------------------- review

  findDueQueue(userId: string, today: Date, limit: number) {
    return this.prisma.userVocab.findMany({
      where: { userId, dueOn: { lte: today }, state: { not: "suspended" } },
      orderBy: [{ dueOn: "asc" }, { savedAt: "asc" }],
      take: limit,
      include: { vocabItem: true },
    });
  }

  createReviewSession(userId: string, cardsTotal: number) {
    return this.prisma.vocabReviewSession.create({ data: { userId, cardsTotal } });
  }

  findReviewSession(id: bigint, userId: string) {
    return this.prisma.vocabReviewSession.findFirst({ where: { id, userId } });
  }

  findUserVocab(id: bigint, userId: string) {
    return this.prisma.userVocab.findFirst({ where: { id, userId } });
  }

  /** Applies one rating: writes the review log row, reschedules the card, bumps the session tally. */
  applyReview(params: {
    sessionId: bigint;
    userVocabId: bigint;
    rating: SrsRating;
    known: boolean;
    revealedMs?: number;
    intervalBefore: number;
    next: SrsResult;
    dueOn: Date;
  }) {
    const { sessionId, userVocabId, rating, known, revealedMs, intervalBefore, next, dueOn } = params;
    const reviewedAt = new Date();
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.vocabReview.create({
        data: {
          sessionId,
          userVocabId,
          rating,
          revealedMs,
          reviewedAt,
          intervalBefore,
          intervalAfter: next.intervalDays,
        },
      });
      const card = await tx.userVocab.update({
        where: { id: userVocabId },
        data: {
          state: next.state,
          ease: next.ease,
          intervalDays: next.intervalDays,
          reps: next.reps,
          lapses: next.lapses,
          dueOn,
          lastReviewedAt: reviewedAt,
        },
      });
      await tx.vocabReviewSession.update({
        where: { id: sessionId },
        data: { cardsKnown: known ? { increment: 1 } : undefined },
      });
      return { review, card };
    });
  }

  async finishReviewSession(id: bigint, userId: string) {
    const [reviewed, nextDue] = await Promise.all([
      this.prisma.vocabReview.count({ where: { sessionId: id } }),
      this.prisma.userVocab.aggregate({
        _min: { dueOn: true },
        where: { userId, state: { not: "suspended" } },
      }),
    ]);
    return this.prisma.vocabReviewSession.update({
      where: { id },
      data: { finishedAt: new Date(), cardsTotal: reviewed, nextDueOn: nextDue._min.dueOn },
    });
  }
}

export type NotebookFilter = Prisma.UserVocabWhereInput;
