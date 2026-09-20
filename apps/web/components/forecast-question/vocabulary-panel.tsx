"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { useSpeakWord } from "@/hooks/use-speak-word";
import type { ForecastQuestionPractice, QuestionVocabBand, QuestionVocabItem } from "@/types/forecast-question";

type BandKey = QuestionVocabBand;
type PanelTab = "vocab" | "ai" | "gold";

const bands: BandKey[] = ["6", "7", "8"];

interface VocabTagProps {
  item: QuestionVocabItem;
  saved: boolean;
  isSpeaking: boolean;
  isPending: boolean;
  onSpeak: () => void;
  onToggleSave: () => void;
}

function VocabTag({ item, saved, isSpeaking, isPending, onSpeak, onToggleSave }: VocabTagProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border py-1.5 pr-1.5 pl-3 transition-colors",
        saved ? "border-brand-300 bg-brand-50" : "border-border bg-surface"
      )}
    >
      <button
        type="button"
        onClick={onSpeak}
        aria-label={`Nghe cách đọc "${item.phrase}"`}
        className={cn("min-w-0 cursor-pointer text-left", isSpeaking && "text-brand-700")}
      >
        <span className="flex items-center gap-1 text-sm font-bold text-ink-900">
          {item.phrase}
          <Volume2 className={cn("size-3.5 shrink-0", isSpeaking ? "text-brand-600" : "text-ink-400")} />
        </span>
        <span className="block text-xs text-ink-500">{item.meaning}</span>
      </button>
      <button
        type="button"
        aria-pressed={saved}
        disabled={isPending}
        aria-label={saved ? `Bỏ lưu "${item.phrase}"` : `Lưu "${item.phrase}" để học sau`}
        onClick={onToggleSave}
        className={cn(
          "ml-auto flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors disabled:cursor-wait disabled:opacity-50",
          saved ? "text-brand-600 hover:bg-brand-100" : "text-ink-400 hover:bg-page hover:text-brand-600"
        )}
      >
        {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
      </button>
    </div>
  );
}

interface VocabularyPanelProps {
  vocabularyByBand: ForecastQuestionPractice["vocabularyByBand"];
  onSave: (vocabItemId: string) => Promise<unknown>;
  onRemove: (userVocabId: string) => Promise<unknown>;
  onSaveMany: (vocabItemIds: string[]) => Promise<unknown>;
}

export function VocabularyPanel({ vocabularyByBand, onSave, onRemove, onSaveMany }: VocabularyPanelProps) {
  const [tab, setTab] = useState<PanelTab>("vocab");
  const [band, setBand] = useState<BandKey>("6");
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const { speak, speakingId } = useSpeakWord();

  const items = vocabularyByBand[band];
  const unsaved = items.filter((item) => !item.saved);

  async function withPending(ids: string[], action: () => Promise<unknown>) {
    setPendingIds((prev) => new Set([...prev, ...ids]));
    try {
      await action();
    } finally {
      setPendingIds((prev) => new Set([...prev].filter((id) => !ids.includes(id))));
    }
  }

  const toggle = (item: QuestionVocabItem) =>
    withPending([item.id], () => (item.saved && item.userVocabId ? onRemove(item.userVocabId) : onSave(item.id)));

  const tabs: { id: PanelTab; label: string; extra?: React.ReactNode }[] = [
    { id: "vocab", label: "Từ vựng", extra: <span className="font-normal text-ink-400">({vocabularyByBand["6"].length})</span> },
    { id: "ai", label: "AI hỗ trợ", extra: <Badge size="sm" className="bg-violet-600 text-white">MỚI</Badge> },
    { id: "gold", label: "Bảng vàng", extra: <span className="size-1.5 rounded-full bg-flame" /> },
  ];

  return (
    <aside className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
      <div role="tablist" className="flex gap-6 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 pb-3 text-sm font-bold",
              tab === t.id ? "border-brand-600 text-brand-700" : "border-transparent text-ink-500"
            )}
          >
            {t.label}
            {t.extra}
          </button>
        ))}
      </div>

      {tab === "vocab" ? (
        <>
          <div className="grid grid-cols-3 rounded-full bg-page p-1">
            {bands.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBand(b)}
                className={cn("rounded-full py-1.5 text-sm font-bold", band === b ? "bg-brand-500 text-white" : "text-ink-500 hover:text-ink-900")}
              >
                Band {b}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-500">{items.length} cụm gợi ý cho band {band}</span>
            <button
              type="button"
              onClick={() => {
                const ids = unsaved.map((item) => item.id);
                void withPending(ids, () => onSaveMany(ids));
              }}
              disabled={unsaved.length === 0 || items.some((item) => pendingIds.has(item.id))}
              className="cursor-pointer font-bold text-brand-700 disabled:cursor-default disabled:text-ink-400"
            >
              {unsaved.length === 0 ? "Đã lưu hết" : `Lưu cả ${unsaved.length}`}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <VocabTag
                key={item.id}
                item={item}
                saved={item.saved}
                isSpeaking={speakingId === item.id}
                isPending={pendingIds.has(item.id)}
                onSpeak={() => speak(item.phrase, item.id)}
                onToggleSave={() => toggle(item)}
              />
            ))}
          </div>

          <p className="text-xs text-ink-400">Từ đã lưu sẽ có trong sổ từ vựng để ôn lại sau.</p>
        </>
      ) : (
        <p className="py-10 text-center text-sm text-ink-400">Sắp ra mắt</p>
      )}
    </aside>
  );
}
