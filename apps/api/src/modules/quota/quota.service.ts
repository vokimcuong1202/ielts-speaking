import { ForbiddenException, Injectable } from "@nestjs/common";
import { QuotaRepository } from "./quota.repository";
import { QuotaSummary } from "./models/quota-summary.model";
import { AiCallType } from "../../../../../database/generated/client";

@Injectable()
export class QuotaService {
  constructor(private readonly quotaRepository: QuotaRepository) {}

  private currentMonthPeriod(now = new Date()) {
    const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const periodEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    return { periodStart, periodEnd };
  }

  async getSummary(userId: string): Promise<QuotaSummary> {
    const { periodStart, periodEnd } = this.currentMonthPeriod();
    const usedSeconds = await this.quotaRepository.sumUsageSecondsInPeriod(
      userId,
      AiCallType.stt,
      periodStart,
      periodEnd,
    );
    const quotaSeconds = parseInt(process.env.DEFAULT_PLAN_QUOTA_SECONDS ?? "1800", 10);

    return {
      quotaSeconds,
      usedSeconds,
      remainingSeconds: quotaSeconds - usedSeconds,
      periodStart,
      periodEnd,
    };
  }

  async assertHasQuota(userId: string, requiredSeconds: number) {
    const summary = await this.getSummary(userId);
    if (summary.remainingSeconds < requiredSeconds) {
      throw new ForbiddenException("Speaking quota exceeded for this billing period.");
    }
  }

  recordTranscriptionUsage(
    userId: string,
    attemptId: string,
    durationSeconds: number,
    provider: string,
    cost?: number,
  ) {
    return this.quotaRepository.recordUsage({
      userId,
      attemptId,
      callType: AiCallType.stt,
      provider,
      durationOrTokens: durationSeconds,
      estimatedCostUsd: cost,
    });
  }

  recordEvaluationUsage(userId: string, attemptId: string, provider: string, tokens?: number, cost?: number) {
    return this.quotaRepository.recordUsage({
      userId,
      attemptId,
      callType: AiCallType.llm_scoring,
      provider,
      durationOrTokens: tokens,
      estimatedCostUsd: cost,
    });
  }
}
