import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { toDateOnly } from "../../common/utils/local-date";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UpdateGoalDto } from "./dto/update-goal.dto";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateUserDto & { passwordHash: string }) {
    return this.prisma.user.create({ data: dto });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        displayName: true,
        handle: true,
        avatarUrl: true,
        locale: true,
        timezone: true,
        createdAt: true,
        lastActiveAt: true,
        userGoal: true,
        userStreak: true,
      },
    });
  }

  updateProfile(id: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, displayName: true, handle: true, avatarUrl: true, locale: true, timezone: true },
    });
  }

  upsertGoal(userId: string, dto: UpdateGoalDto) {
    const data = {
      targetBand: dto.targetBand,
      examDate: dto.examDate ? toDateOnly(dto.examDate.slice(0, 10)) : null,
      ...(dto.weeklyTargetSessions !== undefined && { weeklyTargetSessions: dto.weeklyTargetSessions }),
    };
    return this.prisma.userGoal.upsert({
      where: { userId },
      create: { userId, ...data },
      update: { ...data, updatedAt: new Date() },
    });
  }
}
