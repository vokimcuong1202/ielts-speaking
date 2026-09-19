import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { CreateSessionDto } from "./dto/create-session.dto";

@Injectable()
export class PracticeSessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateSessionDto) {
    return this.prisma.practiceSession.create({
      data: {
        userId,
        mode: dto.mode,
        part: dto.part,
        forecastSetId: dto.forecastSetId,
        topicGroupId: dto.topicGroupId,
        voiceCode: dto.voiceCode,
        questionCount: dto.questionCount,
        hideQuestion: dto.hideQuestion,
      },
    });
  }

  findOwned(id: bigint, userId: string) {
    return this.prisma.practiceSession.findFirst({ where: { id, userId } });
  }

  finish(id: bigint, abandoned: boolean) {
    return this.prisma.practiceSession.update({
      where: { id },
      data: { finishedAt: new Date(), abandoned },
    });
  }

  findByIdWithResults(id: bigint, userId: string) {
    return this.prisma.practiceSession.findFirst({
      where: { id, userId },
      include: {
        topicGroup: true,
        examinerVoice: true,
        attempts: {
          orderBy: { recordedAt: "asc" },
          include: { question: true, attemptScores: true },
        },
      },
    });
  }

  findHistoryForUser(userId: string) {
    return this.prisma.practiceSession.findMany({
      where: { userId },
      include: { topicGroup: true, _count: { select: { attempts: true } } },
      orderBy: { startedAt: "desc" },
    });
  }

  findActiveVoices() {
    return this.prisma.examinerVoice.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  }
}
