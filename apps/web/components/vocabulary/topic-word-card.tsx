"use client";

import { Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSpeakWord } from "@/hooks/use-speak-word";
import type { VocabularyTopicWordEntry } from "@/types/vocabulary";

export function TopicWordCard({ word }: { word: VocabularyTopicWordEntry }) {
  const { speak, speakingId } = useSpeakWord();
  const isSpeaking = speakingId === word.id;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-border p-4">
      <button
        type="button"
        onClick={() => speak(word.word, word.id)}
        aria-label={`Nghe cách đọc "${word.word}"`}
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
        <p className="flex flex-wrap items-baseline gap-2">
          <span className="text-base font-bold text-ink-900">{word.word}</span>
          <span className="font-mono text-xs text-ink-400">{word.phonetic}</span>
        </p>
        <p className="mt-1 text-sm text-ink-600">{word.meaning}</p>
        <p className="mt-2 text-sm italic text-ink-500">&ldquo;{word.example}&rdquo;</p>
      </div>
    </div>
  );
}
