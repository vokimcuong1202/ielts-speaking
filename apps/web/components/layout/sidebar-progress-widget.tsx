import { ProgressRing } from "@/components/ui/progress-ring";
import type { SidebarProgress } from "@/types/user";

export function SidebarProgressWidget({ progress }: { progress: SidebarProgress }) {
  return (
    <div className="flex items-center justify-center px-1 py-3">
      <ProgressRing
        value={progress.completed}
        max={progress.total}
        size={104}
        strokeWidth={8}
        trackClassName="stroke-border"
        indicatorClassName="stroke-brand-600"
      >
        <span className="text-xl font-bold text-ink-900">
          {progress.completed}
          <span className="font-medium text-ink-400">/{progress.total}</span>
        </span>
      </ProgressRing>
    </div>
  );
}
