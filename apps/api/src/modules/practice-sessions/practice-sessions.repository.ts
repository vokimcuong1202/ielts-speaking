import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { SessionStatus } from "../../../../../database/generated/client";
import { CreateSessionDto } from "./dto/create-session.dto";

@Injectable()
export class PracticeSessionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateSessionDto) {
    return this.prisma.practiceSession.create({
      data: {
        userId,
        type: dto.type,
        topicGroupId: dto.topicGroupId,
        status: SessionStatus.in_progress,
      },
    });
  }

  complete(id: string) {
    return this.prisma.practiceSession.update({
      where: { id },
      data: { status: SessionStatus.completed, completedAt: new Date() },
    });
  }

  createSessionScore(sessionId: string, scores: {
    fluencyCoherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
    overallBand: number;
  }) {
    return this.prisma.sessionScore.create({ data: { sessionId, ...scores } });
  }

  findByIdWithResults(id: string) {
    return this.prisma.practiceSession.findUnique({
      where: { id },
      include: {
        attempts: { include: { question: true, score: true } },
        sessionScore: true,
        topicGroup: true,
      },
    });
  }

  findHistoryForUser(userId: string) {
    return this.prisma.practiceSession.findMany({
      where: { userId },
      include: { sessionScore: true, topicGroup: true },
      orderBy: { startedAt: "desc" },
    });
  }
}
