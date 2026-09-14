export interface QuotaSummary {
  quotaSeconds: number;
  usedSeconds: number;
  remainingSeconds: number;
  periodStart: string;
  periodEnd: string;
}
