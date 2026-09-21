"use client";

import { useRef, useState } from "react";
import { Heart, Info, Play, Volume2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useSpeakWord } from "@/hooks/use-speak-word";
import { SelectionPopover, type SelectionAnchor } from "./selection-popover";
import type { SupportSample } from "@/types/answer-support";

const MAX_SELECTION_CHARS = 300;

/** Splits `text` so every occurrence of a phrase can be highlighted. */
function highlightPhrases(text: string, phrases: string[]) {
  if (phrases.length === 0) return [{ text, isPhrase: false }];
  const escaped = phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return text
    .split(new RegExp(`(${escaped.join("|")})`, "gi"))
    .filter(Boolean)
    .map((part) => ({ text: part, isPhrase: phrases.some((phrase) => phrase.toLowerCase() === part.toLowerCase()) }));
}

interface SampleCardProps {
  sample: SupportSample;
  questionId: string;
  isTranslationMock: boolean;
}

export function SampleCard({ sample, questionId, isTranslationMock }: SampleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const [anchor, setAnchor] = useState<SelectionAnchor | null>(null);
  const { speak, speakingId } = useSpeakWord();
  const isSpeaking = speakingId === sample.id;

  /** Anchors the popover just under `rect`, kept inside the card. */
  function anchorBelow(rect: DOMRect, text: string) {
    const card = cardRef.current?.getBoundingClientRect();
    if (!card) return;
    const left = Math.min(Math.max(rect.left - card.left, 0), Math.max(card.width - 256, 0));
    setAnchor({ text, top: rect.bottom - card.top + 6, left });
  }

  function onSelect() {
    const selection = window.getSelection();
    const text = selection?.toString().replace(/\s+/g, " ").trim() ?? "";
    if (!selection || selection.rangeCount === 0 || text.length < 2 || text.length > MAX_SELECTION_CHARS) return;
    anchorBelow(selection.getRangeAt(0).getBoundingClientRect(), text);
  }

  return (
    <div ref={cardRef} className="relative rounded-2xl border border-brand-200 bg-brand-50/60 p-4">
      <button
        type="button"
        aria-label="Nghe câu mẫu"
        onClick={() => speak(sample.body, sample.id)}
        className={cn(
          "flex size-10 cursor-pointer items-center justify-center rounded-full border-2 transition-colors",
          isSpeaking ? "border-brand-600 bg-brand-600 text-white" : "border-brand-500 text-brand-600 hover:bg-brand-100"
        )}
      >
        {isSpeaking ? <Volume2 className="size-4" /> : <Play className="ml-0.5 size-4 fill-current" />}
      </button>

      <p onMouseUp={onSelect} className="mt-3 text-base leading-8 text-ink-900 selection:bg-brand-200">
        {highlightPhrases(sample.body, sample.phrases.map((phrase) => phrase.phrase)).map((part, index) =>
          part.isPhrase ? (
            <mark key={index} className="rounded bg-success-bg/80 px-1 text-inherit">
              {part.text}
            </mark>
          ) : (
            <span key={index}>{part.text}</span>
          )
        )}
      </p>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3 text-sm text-ink-500">
        <span className="flex items-center gap-2">
          <Info className="size-4 shrink-0 text-brand-600" />
          Bôi đen cụm từ bất kỳ để dịch và lưu vào sổ
        </span>
        <button
          ref={heartRef}
          type="button"
          aria-label="Dịch và lưu cả câu vào sổ"
          onClick={() => heartRef.current && anchorBelow(heartRef.current.getBoundingClientRect(), sample.body)}
          className="cursor-pointer text-ink-400 transition-colors hover:text-danger-text"
        >
          <Heart className="size-5 fill-current" />
        </button>
      </div>

      {anchor ? (
        <SelectionPopover anchor={anchor} questionId={questionId} isTranslationMock={isTranslationMock} onClose={() => setAnchor(null)} />
      ) : null}
    </div>
  );
}
