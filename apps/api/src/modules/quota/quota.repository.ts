import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { PlanCode, QuotaKind } from "../../../../../database/generated/client";

@Injectable()
export class QuotaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTimezone(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { timezone: true } });
    return user?.timezone ?? "Asia/Ho_Chi_Minh";
  }

  /** The user's live paid plan, falling back to the free plan. */
  async findPlanForUser(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: "active",
        OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gt: new Date() } }],
      },
      orderBy: { startedAt: "desc" },
      include: { plan: true },
    });
    if (subscription) return subscription.plan;
    return this.prisma.plan.findUniqueOrThrow({ where: { code: PlanCode.free } });
  }

  findUsage(userId: string, usageDate: Date) {
    return this.prisma.quotaUsage.findMany({ where: { userId, usageDate } });
  }

  /** Bumps today's counter and snapshots the allowance that applied (quota_usage.allowance). */
  increment(userId: string, usageDate: Date, kind: QuotaKind, amount: number, allowance: number | null) {
    return this.prisma.quotaUsage.upsert({
      where: { userId_usageDate_kind: { userId, usageDate, kind } },
      create: { userId, usageDate, kind, used: amount, allowance },
      update: { used: { increment: amount }, allowance },
    });
  }
}
