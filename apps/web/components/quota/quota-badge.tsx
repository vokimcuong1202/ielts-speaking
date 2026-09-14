import type { QuotaSummary } from "@repo/shared-types";

export function QuotaBadge({ quota }: { quota: QuotaSummary }) {
  return (
    <span>
      {quota.remainingSeconds}s / {quota.quotaSeconds}s remaining this period
    </span>
  );
}
