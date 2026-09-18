"use client";

import { Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSpeakWord } from "@/hooks/use-speak-word";
import type { VocabularyWordEntry } from "@/types/vocabulary";

export function VocabularyWordChip({ entry }: { entry: VocabularyWordEntry }) {
  const { speak, speakingId } = useSpeakWord();
  const isSpeaking = speakingId === entry.id;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border p-3">
      <button
        type="button"
        onClick={() => speak(entry.word, entry.id)}
        aria-label={`Nghe cách đọc "${entry.word}"`}
        className={cn(
          "flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors",
          isSpeaking ? "border-brand-600 bg-brand-600 text-white" : "border-brand-500 text-brand-700 hover:bg-brand-50"
        )}
      >
        {isSpeaking ? (
          <Volume2 className="h-3.5 w-3.5" strokeWidth={2.5} />
        ) : (
          <Play className="ml-0.5 h-3 w-3" fill="currentColor" strokeWidth={0} />
        )}
      </button>
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink-900">{entry.word}</p>
        <p className="mt-0.5 text-xs text-ink-500">{entry.meaning}</p>
      </div>
    </div>
  );
}
