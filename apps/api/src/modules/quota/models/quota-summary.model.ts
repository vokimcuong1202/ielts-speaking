export interface QuotaSummary {
  quotaSeconds: number;
  usedSeconds: number;
  remainingSeconds: number;
  periodStart: Date;
  periodEnd: Date;
}
