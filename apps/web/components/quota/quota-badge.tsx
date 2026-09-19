import type { QuotaSummary } from "@repo/shared-types";

export function QuotaBadge({ quota }: { quota: QuotaSummary }) {
  const turns = quota.usage.find((item) => item.kind === "speaking_turn");
  if (!turns || turns.allowance === null) return <span>Unlimited speaking turns</span>;

  return (
    <span>
      {turns.used}/{turns.allowance} speaking turns used today
    </span>
  );
}
