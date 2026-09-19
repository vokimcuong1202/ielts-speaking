import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ForecastClusterPracticeCta() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-brand-200 bg-surface p-4">
      <p className="text-sm text-ink-600">
        Luyện liền 3 câu như trong phòng thi — giám khảo hỏi nối, không nghỉ giữa câu.
      </p>
      <Button variant="primary" size="sm" className="mt-auto">
        <Play className="h-3.5 w-3.5" strokeWidth={2.5} fill="currentColor" />
        Luyện cả chùm
      </Button>
    </div>
  );
}
