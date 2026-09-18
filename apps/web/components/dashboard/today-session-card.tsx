"use client";

import { useState } from "react";
import { Lightbulb, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PartStep } from "./part-step";
import { cn } from "@/lib/cn";
import type { TodaySession } from "@/types/dashboard";

export function TodaySessionCard({ session }: { session: TodaySession }) {
  const defaultTipId = session.parts.find((part) => part.status === "active")?.id ?? session.parts[0]?.id;
  const [activeTipId, setActiveTipId] = useState(defaultTipId);

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
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
          <span className="motion-safe:animate-mic-ring pointer-events-none absolute inset-0 rounded-full bg-brand-500/50" />
          <span className="motion-safe:animate-mic-ring pointer-events-none absolute inset-0 rounded-full bg-brand-500/50 [animation-delay:1.2s]" />
          <button
            type="button"
            className="group motion-safe:animate-mic-breathe relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-full bg-brand-800 text-white shadow-lg transition-[transform,background-color] duration-200 ease-out hover:scale-105 hover:bg-brand-900 active:scale-95"
          >
            <Mic className="h-7 w-7 transition-transform duration-200 group-hover:scale-110" strokeWidth={2} />
            <span className="px-3 text-[10px] font-bold leading-tight">
              NHẤN ĐỂ
              <br />
              TEST NGAY
            </span>
          </button>
        </div>

        <div>
          <h3 className="text-xl font-bold text-ink-900">{session.title}</h3>
          <p className="mt-1 text-sm text-ink-500">{session.description}</p>
          <div className="mt-3 grid text-left text-xs text-brand-700">
            {session.parts.map((part) => (
              <div
                key={part.id}
                className={cn(
                  "col-start-1 row-start-1 flex items-start gap-2 rounded-lg bg-brand-50 px-3 py-2 transition-all duration-300 ease-out",
                  activeTipId === part.id
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                )}
              >
                <Lightbulb className="h-4 w-4 shrink-0" strokeWidth={2} color="orange" />
                <span>{part.tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        {session.parts.map((part) => (
          <PartStep
            key={part.id}
            step={part}
            onHoverChange={(hovered) => setActiveTipId(hovered ? part.id : defaultTipId)}
          />
        ))}
      </div>
    </Card>
  );
}
