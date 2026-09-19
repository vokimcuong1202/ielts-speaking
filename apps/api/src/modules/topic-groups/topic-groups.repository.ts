import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { IeltsPart } from "../../../../../database/generated/client";
import { CreateTopicGroupDto } from "./dto/create-topic-group.dto";

@Injectable()
export class TopicGroupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(part?: IeltsPart) {
    return this.prisma.topicGroup.findMany({
      where: part ? { part } : undefined,
      orderBy: [{ part: "asc" }, { sortOrder: "asc" }, { nameEn: "asc" }],
      include: { _count: { select: { questions: { where: { isActive: true } } } } },
    });
  }

  findByIdWithQuestions(id: bigint) {
    return this.prisma.topicGroup.findUnique({
      where: { id },
      include: {
        questions: {
          where: { isActive: true, parentQuestionId: null },
          orderBy: { id: "asc" },
          include: { _count: { select: { followUps: true } } },
        },
      },
    });
  }

  create(dto: CreateTopicGroupDto) {
    return this.prisma.topicGroup.create({
      data: {
        part: dto.part,
        slug: dto.slug,
        nameEn: dto.nameEn,
        nameVi: dto.nameVi,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }
}
