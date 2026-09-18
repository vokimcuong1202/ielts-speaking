import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WeekStreak } from "@/types/dashboard";

export function WeekStreakCard({ streak }: { streak: WeekStreak }) {
  return (
    <Card className="flex w-full shrink-0 flex-col items-center p-6 text-center lg:w-64">
      <div className="mt-4 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-flame-bg text-flame">
          <Flame className="h-6 w-6" fill="currentColor" strokeWidth={0} />
        </span>
        <p className="text-4xl font-extrabold text-ink-900">{streak.currentStreak}</p>
      </div>
      <p className="mt-1 text-sm font-medium text-ink-700">ngày liên tiếp</p>
      <p className="mt-1 text-xs text-ink-400">Streak mới bắt đầu lúc 0h giờ Việt Nam</p>

      <Badge variant="outline" size="md" className="mt-4 w-fit">
        Kỷ lục: {streak.recordStreak} ngày
      </Badge>
    </Card>
  );
}
