import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { UsageType } from "../../../../../database/generated/client";

@Injectable()
export class QuotaRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveAccount(userId: string, now: Date) {
    return this.prisma.quotaAccount.findFirst({
      where: { userId, periodStart: { lte: now }, periodEnd: { gte: now } },
    });
  }

  createAccount(userId: string, quotaSeconds: number, periodStart: Date, periodEnd: Date) {
    return this.prisma.quotaAccount.create({
      data: { userId, quotaSeconds, periodStart, periodEnd },
    });
  }

  incrementUsedSeconds(quotaAccountId: string, seconds: number) {
    return this.prisma.quotaAccount.update({
      where: { id: quotaAccountId },
      data: { usedSeconds: { increment: seconds } },
    });
  }

  recordUsageEvent(params: {
    userId: string;
    sessionId: string;
    type: UsageType;
    quantity: number;
    provider: string;
    cost?: number;
  }) {
    return this.prisma.usageEvent.create({ data: params });
  }
}
