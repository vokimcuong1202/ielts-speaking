import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { CreateTopicGroupDto } from "./dto/create-topic-group.dto";

@Injectable()
export class TopicGroupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllActive() {
    return this.prisma.topicGroup.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findByIdWithQuestions(id: string) {
    return this.prisma.topicGroup.findUnique({
      where: { id },
      include: {
        questions: { orderBy: [{ part: "asc" }, { orderIndex: "asc" }] },
      },
    });
  }

  create(dto: CreateTopicGroupDto) {
    return this.prisma.topicGroup.create({
      data: {
        name: dto.name,
        forecastSeason: dto.forecastSeason,
        questions: {
          create: dto.questions.map((question) => ({
            part: question.part,
            text: question.text,
            orderIndex: question.orderIndex ?? 0,
            prepSeconds: question.prepSeconds,
            speakSeconds: question.speakSeconds,
          })),
        },
      },
      include: { questions: true },
    });
  }
}
