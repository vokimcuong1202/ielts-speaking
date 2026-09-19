"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { ForecastQuestion, ForecastTagVariant } from "@/types/dashboard";

const partFilters = [
  { id: "part1", label: "Part 1" },
  { id: "part2", label: "Part 2" },
  { id: "part3", label: "Part 3" },
];

const HOT_TOPIC_COUNT = 4;

const badgeVariantByTag: Record<ForecastTagVariant, "hot" | "neutral" | "warning"> = {
  hot: "hot",
  neutral: "neutral",
  warning: "warning",
};

function toPartId(part: string) {
  return part.replace(/\s+/g, "").toLowerCase();
}

export function ForecastPracticeCard({ questions }: { questions: ForecastQuestion[] }) {
  const hotQuestions = questions.filter((question) => question.tagVariant === "hot");
  const topics = (hotQuestions.length > 0 ? hotQuestions : questions).slice(0, HOT_TOPIC_COUNT);

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = topics[activeIndex];

  function showNext() {
    setActiveIndex((index) => (index + 1) % topics.length);
  }

  return (
    <Card className="flex flex-col p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink-900">Luyện theo Forecast</h3>
        <Link href="/forecast" className="text-sm font-medium text-ink-400 hover:text-ink-700">
          Xem 42 chủ đề
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {partFilters.map((part) => (
          <Link
            key={part.id}
            href={`/forecast?part=${part.id}`}
            className="flex cursor-pointer items-center gap-1 rounded-full border border-border-strong px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-700 hover:bg-page"
          >
            {part.label}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
        ))}
      </div>

      {active && (
        <div
          className="mt-5 flex flex-1 flex-col"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <Link
            key={active.id}
            href={`/forecast?part=${toPartId(active.part)}`}
            className="animate-forecast-in group flex flex-1 flex-col justify-between gap-6 rounded-2xl border border-border bg-gradient-to-br from-brand-50 to-surface p-6 transition-colors hover:border-brand-300"
          >
            <div className="flex items-center justify-between">
              <Badge variant={badgeVariantByTag[active.tagVariant]} size="sm">
                {active.tagLabel}
              </Badge>
              <span className="text-xs font-semibold text-ink-400">{active.part}</span>
            </div>

            <div className="flex flex-col gap-3">
              <Flame className="h-8 w-8 text-flame" fill="currentColor" strokeWidth={0} />
              <p className="text-2xl font-extrabold leading-snug text-ink-900">{active.title}</p>
            </div>

            <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-700">
              Luyện ngay
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
            </span>
          </Link>

          <div className="mt-4 flex gap-2">
            {topics.map((topic, index) => (
              <button
                key={topic.id}
                type="button"
                aria-label={`Chủ đề ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className="h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-border"
              >
                <span
                  key={index === activeIndex ? `${topic.id}-active` : topic.id}
                  onAnimationEnd={showNext}
                  className={cn(
                    "block h-full origin-left rounded-full bg-brand-600",
                    index < activeIndex && "scale-x-100",
                    index > activeIndex && "scale-x-0",
                    index === activeIndex && "animate-forecast-progress",
                    index === activeIndex && paused && "[animation-play-state:paused]"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
