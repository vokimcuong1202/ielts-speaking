import { Lightbulb, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PartStep } from "./part-step";
import type { TodaySession } from "@/types/dashboard";

export function TodaySessionCard({ session }: { session: TodaySession }) {
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">
            CHẶNG {session.stage}/{session.totalStages}
          </Badge>
          <Badge variant="warning" size="sm">
            {session.forecastLabel}
          </Badge>
        </div>
        <span className="text-sm text-ink-400">≈ {session.estimatedMinutes} phút</span>
      </div>

      <div className="mt-5 flex flex-col items-center gap-5 border-b border-border pb-6 text-center sm:flex-row sm:items-center sm:text-left">
        <button
          type="button"
          className="flex h-32 w-32 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full bg-brand-800 text-white shadow-lg transition-colors hover:bg-brand-900"
        >
          <Mic className="h-7 w-7" strokeWidth={2} />
          <span className="px-3 text-[10px] font-bold leading-tight">
            NHẤN ĐỂ
            <br />
            TEST NGAY
          </span>
        </button>

        <div>
          <h3 className="text-xl font-bold text-ink-900">{session.title}</h3>
          <p className="mt-1 text-sm text-ink-500">{session.description}</p>
          <div className="mt-3 flex items-start gap-2 rounded-lg bg-brand-50 px-3 py-2 text-left text-xs text-brand-700">
            <Lightbulb className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span>{session.tip}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        {session.parts.map((part) => (
          <PartStep key={part.id} step={part} />
        ))}
      </div>
    </Card>
  );
}
