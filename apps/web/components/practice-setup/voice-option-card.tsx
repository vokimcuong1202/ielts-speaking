"use client";

import { Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSpeakWord } from "@/hooks/use-speak-word";
import type { PracticeVoiceOption } from "@/types/practice-setup";

const SAMPLE_PHRASE = "Hello, I will be your examiner today.";

interface VoiceOptionCardProps {
  voice: PracticeVoiceOption;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function VoiceOptionCard({ voice, isSelected, onSelect }: VoiceOptionCardProps) {
  const { speak, speakingId } = useSpeakWord();
  const isSpeaking = speakingId === voice.id;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(voice.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(voice.id);
        }
      }}
      className={cn(
        "flex flex-1 cursor-pointer flex-col gap-3 rounded-xl border p-4 outline-none transition-colors",
        isSelected ? "border-brand-600 bg-brand-50/60" : "border-border-strong hover:border-brand-300"
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            isSelected ? "bg-brand-700 text-white" : "bg-page text-ink-500"
          )}
        >
          {voice.initial}
        </span>
        <div>
          <p className="text-sm font-bold text-ink-900">{voice.name}</p>
          <p className="text-xs text-ink-400">{voice.genderLabel}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          speak(SAMPLE_PHRASE, voice.id);
        }}
        className="flex w-fit cursor-pointer items-center gap-1.5 text-xs font-semibold text-brand-700 hover:underline"
      >
        {isSpeaking ? (
          <Volume2 className="h-3.5 w-3.5" strokeWidth={2.5} />
        ) : (
          <Play className="h-3 w-3" fill="currentColor" strokeWidth={0} />
        )}
        Nghe thử
      </button>
    </div>
  );
}
