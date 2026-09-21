import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";

@Injectable()
export class AnswerSupportRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Accepts a numeric id or slug, like the practice page endpoint. */
  findQuestion(idOrSlug: string) {
    const where = /^\d+$/.test(idOrSlug) ? { id: BigInt(idOrSlug) } : { slug: idOrSlug };
    return this.prisma.question.findFirst({
      where: { ...where, isActive: true },
      include: {
        sampleAnswers: { orderBy: { band: "asc" } },
        questionVocab: { orderBy: [{ isCore: "desc" }, { bandTier: "desc" }, { sortOrder: "asc" }], include: { vocabItem: true } },
      },
    });
  }

  findSavedVocab(userId: string, vocabItemIds: bigint[]) {
    return this.prisma.userVocab.findMany({ where: { userId, vocabItemId: { in: vocabItemIds } }, select: { id: true, vocabItemId: true } });
  }

  findNote(userId: string, questionId: bigint) {
    return this.prisma.userQuestionNote.findUnique({ where: { userId_questionId: { userId, questionId } } });
  }

  saveNote(userId: string, questionId: bigint, body: string) {
    return this.prisma.userQuestionNote.upsert({
      where: { userId_questionId: { userId, questionId } },
      create: { userId, questionId, body },
      update: { body, updatedAt: new Date() },
    });
  }

  deleteNote(userId: string, questionId: bigint) {
    return this.prisma.userQuestionNote.deleteMany({ where: { userId, questionId } });
  }

  /** Meaning of a phrase the catalogue already knows (case-insensitive exact match). */
  findKnownMeaning(term: string) {
    return this.prisma.vocabItem.findFirst({
      where: { term: { equals: term, mode: "insensitive" } },
      select: { meaningVi: true },
      orderBy: { id: "asc" },
    });
  }
}
