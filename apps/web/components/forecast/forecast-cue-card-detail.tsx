import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ForecastCueCard } from "@/types/forecast";

export function ForecastCueCardDetail({ cueCard }: { cueCard: ForecastCueCard }) {
  return (
    <Card id={`forecast-cue-card-${cueCard.id}`} className="scroll-mt-6 border-brand-500 bg-brand-50/30 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {cueCard.tag ? (
            <Badge variant={cueCard.tag.variant} size="md">
              {cueCard.tag.label}
            </Badge>
          ) : null}
          <h3 className="text-lg font-extrabold text-ink-900">{cueCard.title}</h3>
        </div>
        <span className="shrink-0 text-xs text-ink-400">{cueCard.statusLabel}</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-xs font-bold tracking-wide text-ink-400 uppercase">Cue card</p>
          <p className="mt-2 text-sm font-semibold text-ink-700">You should say:</p>
          <ul className="mt-1.5 flex flex-col gap-1">
            {cueCard.prompts.map((prompt, index) => (
              <li key={index} className="flex gap-2 text-sm text-ink-600">
                <span className="text-ink-400">—</span>
                {prompt}
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-border pt-3 text-xs text-ink-400">
            {cueCard.prepMinutes} phút chuẩn bị · {cueCard.speakMinutes} phút nói
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-ink-900">Từ &amp; cụm nên dùng</p>
              <a href="#" className="shrink-0 text-xs font-semibold text-brand-700 hover:underline">
                Lưu cả {cueCard.vocabulary.length} vào sổ →
              </a>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {cueCard.vocabulary.map((word) => (
                <span key={word} className="rounded-full border border-border-strong bg-page px-3 py-1.5 text-sm text-ink-700">
                  {word}
                </span>
              ))}
            </div>
          </div>

          <Button variant="primary" size="lg" className="w-full">
            <Play className="h-3.5 w-3.5" strokeWidth={2.5} fill="currentColor" />
            Luyện topic này
          </Button>

          {cueCard.followUpCount > 0 ? (
            <a href="#" className="text-right text-xs font-semibold text-ink-400 hover:text-brand-700 hover:underline">
              Nối sang {cueCard.followUpCount} câu Part 3 →
            </a>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
