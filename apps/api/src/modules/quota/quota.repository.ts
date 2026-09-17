import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/database/prisma.service";
import { AiCallType } from "../../../../../database/generated/client";

@Injectable()
export class QuotaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async sumUsageSecondsInPeriod(userId: string, callType: AiCallType, periodStart: Date, periodEnd: Date) {
    const result = await this.prisma.aiUsageLog.aggregate({
      _sum: { durationOrTokens: true },
      where: {
        userId,
        callType,
        createdAt: { gte: periodStart, lt: periodEnd },
      },
    });

    return result._sum.durationOrTokens?.toNumber() ?? 0;
  }

  recordUsage(params: {
    userId: string;
    attemptId?: string;
    callType: AiCallType;
    provider: string;
    durationOrTokens?: number;
    estimatedCostUsd?: number;
  }) {
    return this.prisma.aiUsageLog.create({
      data: {
        userId: params.userId,
        attemptId: params.attemptId,
        callType: params.callType,
        provider: params.provider,
        durationOrTokens: params.durationOrTokens,
        estimatedCostUsd: params.estimatedCostUsd,
      },
    });
  }
}
