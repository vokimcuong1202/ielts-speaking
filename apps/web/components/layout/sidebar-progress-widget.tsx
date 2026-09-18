import { ProgressRing } from "@/components/ui/progress-ring";
import type { SidebarProgress } from "@/types/user";

export function SidebarProgressWidget({ progress }: { progress: SidebarProgress }) {
  return (
    <div className="flex items-center px-1 py-2">
      <ProgressRing
        value={progress.completed}
        max={progress.total}
        size={64}
        strokeWidth={5}
        trackClassName="stroke-border"
        indicatorClassName="stroke-brand-600"
      >
        <span className="text-sm font-bold text-ink-900">
          {progress.completed}
          <span className="font-medium text-ink-400">/{progress.total}</span>
        </span>
      </ProgressRing>
    </div>
  );
}
