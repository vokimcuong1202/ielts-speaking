import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";

@Injectable()
export class ExercisesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.exercise.findMany({ orderBy: { createdAt: "desc" } });
  }

  findById(id: string) {
    return this.prisma.exercise.findUnique({ where: { id } });
  }

  create(dto: CreateExerciseDto) {
    return this.prisma.exercise.create({ data: dto });
  }
}
