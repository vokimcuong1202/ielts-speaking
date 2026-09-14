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
        exerciseId: dto.exerciseId,
        audioUrl: dto.audioUrl,
        durationSeconds: dto.durationSeconds,
        status: SessionStatus.UPLOADED,
      },
    });
  }

  updateStatus(id: string, status: SessionStatus) {
    return this.prisma.practiceSession.update({ where: { id }, data: { status } });
  }

  findByIdWithResults(id: string) {
    return this.prisma.practiceSession.findUnique({
      where: { id },
      include: { transcription: true, evaluation: true, exercise: true },
    });
  }

  findHistoryForUser(userId: string) {
    return this.prisma.practiceSession.findMany({
      where: { userId },
      include: { evaluation: true, exercise: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
