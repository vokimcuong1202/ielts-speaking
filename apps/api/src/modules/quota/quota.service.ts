import { ForbiddenException, Injectable } from "@nestjs/common";
import { Plan, QuotaKind } from "../../../../../database/generated/client";
import { localDate, localDateString } from "../../common/utils/local-date";
import { QuotaRepository } from "./quota.repository";
import { QuotaKindSummary, QuotaSummary } from "./models/quota-summary.model";

const ALL_KINDS: QuotaKind[] = ["speaking_turn", "ai_scoring", "ai_tutor_message", "mock_test"];

@Injectable()
export class QuotaService {
  constructor(private readonly quotaRepository: QuotaRepository) {}

  /** null = unlimited. `plans` only defines limits for speaking turns and AI scorings. */
  private allowanceFor(plan: Plan, kind: QuotaKind): number | null {
    switch (kind) {
      case "speaking_turn":
        return plan.unlimitedSpeaking ? null : plan.dailySpeakingTurns;
      case "ai_scoring":
        return plan.dailyAiScorings;
      default:
        return null;
    }
  }

  async getSummary(userId: string): Promise<QuotaSummary> {
    const [timezone, plan] = await Promise.all([
      this.quotaRepository.findTimezone(userId),
      this.quotaRepository.findPlanForUser(userId),
    ]);
    const rows = await this.quotaRepository.findUsage(userId, localDate(timezone));

    const usage: QuotaKindSummary[] = ALL_KINDS.map((kind) => {
      const used = rows.find((row) => row.kind === kind)?.used ?? 0;
      const allowance = this.allowanceFor(plan, kind);
      return { kind, used, allowance, remaining: allowance === null ? null : Math.max(0, allowance - used) };
    });

    return { planCode: plan.code, planName: plan.name, date: localDateString(timezone), usage };
  }

  async assertHasQuota(userId: string, kind: QuotaKind) {
    const summary = await this.getSummary(userId);
    const entry = summary.usage.find((item) => item.kind === kind);
    if (entry && entry.remaining !== null && entry.remaining <= 0) {
      throw new ForbiddenException(`Daily ${kind.replace(/_/g, " ")} limit reached (${entry.allowance}).`);
    }
  }

  async consume(userId: string, kind: QuotaKind, amount = 1) {
    const [timezone, plan] = await Promise.all([
      this.quotaRepository.findTimezone(userId),
      this.quotaRepository.findPlanForUser(userId),
    ]);
    return this.quotaRepository.increment(userId, localDate(timezone), kind, amount, this.allowanceFor(plan, kind));
  }
}
