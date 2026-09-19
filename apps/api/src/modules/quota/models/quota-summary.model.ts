import { QuotaKind } from "../../../../../../database/generated/client";

export interface QuotaKindSummary {
  kind: QuotaKind;
  used: number;
  /** null = unlimited */
  allowance: number | null;
  /** null = unlimited */
  remaining: number | null;
}

export interface QuotaSummary {
  planCode: string;
  planName: string;
  /** Local date (users.timezone) the counters belong to, YYYY-MM-DD. */
  date: string;
  usage: QuotaKindSummary[];
}
