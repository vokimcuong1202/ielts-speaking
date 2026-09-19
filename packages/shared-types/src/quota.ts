export type QuotaKind = "speaking_turn" | "ai_scoring" | "ai_tutor_message" | "mock_test";

export interface QuotaKindSummary {
  kind: QuotaKind;
  used: number;
  /** null = unlimited */
  allowance: number | null;
  /** null = unlimited */
  remaining: number | null;
}

export interface QuotaSummary {
  planCode: "free" | "pro";
  planName: string;
  /** Local date (user timezone) the counters belong to, YYYY-MM-DD. */
  date: string;
  usage: QuotaKindSummary[];
}
