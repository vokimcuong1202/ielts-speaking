"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronDown, Play, Volume2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useSpeakWord } from "@/hooks/use-speak-word";
import type { VocabularyReviewSession } from "@/types/vocabulary";

interface VocabularyReviewModalProps {
  session: VocabularyReviewSession;
  onClose: () => void;
}

export function VocabularyReviewModal({ session, onClose }: VocabularyReviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const { speak, speakingId } = useSpeakWord();

  const currentWord = session.words[currentIndex];
  const isLast = currentIndex === session.words.length - 1;
  const isSpeaking = speakingId === currentWord.id;

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
    setIsRevealed(false);
  };

  const handlePrev = () => {
    if (currentIndex > 0) goToIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (!isLast) goToIndex(currentIndex + 1);
    else onClose();
  };

  const handlePrimaryAction = () => {
    if (!isRevealed) setIsRevealed(true);
    else handleNext();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") handlePrev();
      else if (event.key === "ArrowRight") handleNext();
      else if (event.code === "Space") {
        event.preventDefault();
        if (!isRevealed) setIsRevealed(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isRevealed, isLast]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 p-4"
      onClick={onClose}
    >
      <div className="w-full max-w-lg rounded-2xl bg-surface p-5 shadow-xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-3">
          <p className="shrink-0 text-base font-bold text-ink-900">Ôn {session.words.length} từ</p>

          <button
            type="button"
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-border-strong px-3 py-1 text-xs font-semibold text-ink-700 hover:bg-page"
          >
            {session.scopeLabel}
            <ChevronDown className="h-3 w-3" strokeWidth={2} />
          </button>

          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-page">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${((currentIndex + 1) / session.words.length) * 100}%` }}
            />
          </div>

          <p className="shrink-0 text-sm text-ink-400">
            {currentIndex + 1}/{session.words.length}
          </p>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="shrink-0 cursor-pointer rounded-full p-1 text-ink-400 hover:bg-page hover:text-ink-700"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {session.contextBadgeLabel || session.contextText ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {session.contextBadgeLabel ? (
              <Badge variant={session.contextBadgeVariant ?? "brand"} size="sm">
                {session.contextBadgeLabel}
              </Badge>
            ) : null}
            {session.contextText ? <p className="text-sm text-ink-500">{session.contextText}</p> : null}
          </div>
        ) : null}

        <div className="mt-4 flex min-h-55 flex-col items-center justify-center rounded-xl bg-page px-6 py-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-ink-400">{currentWord.categoryLabel}</p>

          <div className="mt-3 flex items-center gap-3">
            <p className="text-2xl font-extrabold text-ink-900">{currentWord.word}</p>
            <button
              type="button"
              onClick={() => speak(currentWord.word, currentWord.id)}
              aria-label={`Nghe cách đọc "${currentWord.word}"`}
              className={cn(
                "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors",
                isSpeaking ? "border-brand-600 bg-brand-600 text-white" : "border-brand-500 text-brand-700 hover:bg-brand-50"
              )}
            >
              {isSpeaking ? (
                <Volume2 className="h-4 w-4" strokeWidth={2.5} />
              ) : (
                <Play className="ml-0.5 h-3.5 w-3.5" fill="currentColor" strokeWidth={0} />
              )}
            </button>
          </div>

          <p className="mt-2 font-mono text-sm text-ink-400">{currentWord.phonetic}</p>

          {isRevealed ? (
            <div className="mt-4">
              <p className="text-base font-semibold text-ink-900">{currentWord.meaning}</p>
              {currentWord.example ? (
                <p className="mt-2 text-sm italic text-ink-500">&ldquo;{currentWord.example}&rdquo;</p>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-400">Nghĩ nghĩa trong đầu rồi bấm &ldquo;Hiện nghĩa&rdquo;</p>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Quay lại từ trước"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-strong text-ink-700 hover:bg-page disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          </button>

          <Button variant="primary" size="lg" className="flex-1" onClick={handlePrimaryAction}>
            {isRevealed ? (isLast ? "Hoàn tất" : "Từ tiếp theo") : "Hiện nghĩa"}
          </Button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Chuyển sang từ tiếp theo"
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-strong text-ink-700 hover:bg-page"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <p className="mt-3 text-center text-xs text-ink-400">← → đổi từ · Space hiện nghĩa</p>
      </div>
    </div>
  );
}
