"use client";

import { Check, Loader2, Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSpeakWord } from "@/hooks/use-speak-word";
import type { SupportPhrase } from "@/types/answer-support";

interface SupportPhraseCardProps {
  phrase: SupportPhrase;
  isPending: boolean;
  onToggleSave: () => void;
  onPractice: () => void;
}

export function SupportPhraseCard({ phrase, isPending, onToggleSave, onPractice }: SupportPhraseCardProps) {
  const { speak, speakingId } = useSpeakWord();
  const isSpeaking = speakingId === phrase.id;

  return (
    <div className={cn("flex flex-col gap-1 rounded-2xl border p-3", phrase.saved ? "border-brand-300 bg-brand-50" : "border-border bg-surface")}>
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-label={`Nghe cách đọc "${phrase.phrase}"`}
          onClick={() => speak(phrase.phrase, phrase.id)}
          className={cn(
            "flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2",
            isSpeaking ? "border-brand-600 bg-brand-600 text-white" : "border-brand-500 text-brand-600 hover:bg-brand-50"
          )}
        >
          {isSpeaking ? <Volume2 className="size-3" /> : <Play className="ml-0.5 size-3 fill-current" />}
        </button>
        <p className="min-w-0 flex-1 text-sm leading-5 font-bold text-ink-900">{phrase.phrase}</p>
        <button
          type="button"
          aria-pressed={phrase.saved}
          aria-label={phrase.saved ? `Bỏ lưu "${phrase.phrase}"` : `Lưu "${phrase.phrase}" vào sổ`}
          disabled={isPending}
          onClick={onToggleSave}
          className={cn(
            "flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border disabled:cursor-wait",
            phrase.saved ? "border-brand-600 bg-brand-600 text-white" : "border-border-strong text-ink-400 hover:border-brand-500 hover:text-brand-600"
          )}
        >
          {isPending ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3.5" />}
        </button>
      </div>
      <p className="text-sm text-ink-500">{phrase.meaning}</p>
      <button type="button" onClick={onPractice} className="w-fit cursor-pointer text-sm font-bold text-brand-600 hover:underline">
        Luyện phát âm
      </button>
    </div>
  );
}
