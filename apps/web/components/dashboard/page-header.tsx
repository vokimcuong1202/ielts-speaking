import { Badge } from "@/components/ui/badge";
import type { UserProfile } from "@/types/dashboard";

export function PageHeader({ user }: { user: UserProfile }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm text-ink-500">{user.todayLabel}</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink-900 sm:text-3xl">
          Buổi tập hôm nay của {user.name}
        </h1>
      </div>

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 shadow-[var(--shadow-card)]">
        <p className="text-sm text-ink-700">
          Mục tiêu <span className="font-bold text-ink-900">{user.goalBand.toFixed(1)}</span> · thi{" "}
          {user.examDateLabel}
        </p>
        <Badge variant="brand" size="md">
          còn {user.daysUntilExam} ngày
        </Badge>
      </div>
    </div>
  );
}
