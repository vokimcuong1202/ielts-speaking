import { ForbiddenException, Injectable } from "@nestjs/common";
import { QuotaRepository } from "./quota.repository";
import { QuotaSummary } from "./models/quota-summary.model";
import { UsageType } from "../../../../../database/generated/client";

@Injectable()
export class QuotaService {
  constructor(private readonly quotaRepository: QuotaRepository) {}

  async createInitialAccount(userId: string) {
    const periodStart = new Date();
    const periodEnd = new Date(periodStart);
    periodEnd.setDate(periodEnd.getDate() + 30);

    const quotaSeconds = parseInt(process.env.DEFAULT_PLAN_QUOTA_SECONDS ?? "1800", 10);

    return this.quotaRepository.createAccount(userId, quotaSeconds, periodStart, periodEnd);
  }

  async getSummary(userId: string): Promise<QuotaSummary | null> {
    const account = await this.quotaRepository.findActiveAccount(userId, new Date());
    if (!account) return null;

    return {
      quotaSeconds: account.quotaSeconds,
      usedSeconds: account.usedSeconds,
      remainingSeconds: account.quotaSeconds - account.usedSeconds,
      periodStart: account.periodStart,
      periodEnd: account.periodEnd,
    };
  }

  async assertHasQuota(userId: string, requiredSeconds: number) {
    const summary = await this.getSummary(userId);
    if (!summary || summary.remainingSeconds < requiredSeconds) {
      throw new ForbiddenException("Speaking quota exceeded for this billing period.");
    }
  }

  async recordTranscriptionUsage(userId: string, sessionId: string, durationSeconds: number, provider: string, cost?: number) {
    const account = await this.quotaRepository.findActiveAccount(userId, new Date());
    if (account) {
      await this.quotaRepository.incrementUsedSeconds(account.id, durationSeconds);
    }

    await this.quotaRepository.recordUsageEvent({
      userId,
      sessionId,
      type: UsageType.TRANSCRIPTION,
      quantity: durationSeconds,
      provider,
      cost,
    });
  }

  async recordEvaluationUsage(userId: string, sessionId: string, provider: string, cost?: number) {
    await this.quotaRepository.recordUsageEvent({
      userId,
      sessionId,
      type: UsageType.EVALUATION,
      quantity: 1,
      provider,
      cost,
    });
  }
}
