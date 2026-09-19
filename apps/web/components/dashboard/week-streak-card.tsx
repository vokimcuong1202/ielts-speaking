import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeekStreak } from "@/types/dashboard";

export function WeekStreakCard({ streak }: { streak: WeekStreak }) {
  return (
    <Card className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 p-6">
      <div className="flex items-center justify-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-flame-bg text-flame">
          <Flame className="h-7 w-7" fill="currentColor" strokeWidth={0} />
        </span>
        <div>
          <p className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold leading-none text-ink-900">{streak.currentStreak}</span>
            <span className="text-sm font-medium text-ink-700">ngày liên tiếp</span>
          </p>
          <p className="mt-1.5 text-xs text-ink-400">Streak mới bắt đầu lúc 0h giờ Việt Nam</p>
        </div>
      </div>

      <Badge variant="outline" size="md" className="w-fit">
        Kỷ lục: {streak.recordStreak} ngày
      </Badge>
    </Card>
  );
}
