"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { BookmarkCheck, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { answerSupportService } from "@/services/answer-support.service";
import { savedVocabularyService } from "@/services/saved-vocabulary.service";

export interface SelectionAnchor {
  text: string;
  /** Position inside the nearest `relative` ancestor. */
  top: number;
  left: number;
}

interface SelectionPopoverProps {
  anchor: SelectionAnchor;
  questionId: string;
  /** True while the translation provider is a placeholder, so an empty result is expected. */
  isTranslationMock: boolean;
  onClose: () => void;
}

/** Translate a selected phrase, let the learner confirm / type the meaning, and save it to the notebook. */
export function SelectionPopover({ anchor, questionId, isTranslationMock, onClose }: SelectionPopoverProps) {
  const [meaning, setMeaning] = useState("");
  const isPristine = useRef(true);
  const ref = useRef<HTMLDivElement>(null);

  const translate = useMutation({
    mutationFn: () => answerSupportService.translate(anchor.text),
    onSuccess: (result) => {
      if (result.translation && isPristine.current) setMeaning(result.translation);
    },
  });
  const save = useMutation({
    mutationFn: () => savedVocabularyService.saveCustom(anchor.text, meaning.trim(), questionId),
    onSuccess: () => window.setTimeout(onClose, 1200),
  });

  const { mutate: runTranslate } = translate;
  useEffect(() => {
    runTranslate();
  }, [anchor.text, runTranslate]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const noTranslation = translate.isSuccess && !translate.data.translation;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Dịch và lưu vào sổ"
      style={{ top: anchor.top, left: anchor.left }}
      className="absolute z-30 w-64 rounded-xl border border-border bg-surface p-3 shadow-[var(--shadow-card)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-3 text-sm font-bold text-ink-900">{anchor.text}</p>
        <button type="button" aria-label="Đóng" onClick={onClose} className="cursor-pointer text-ink-400 hover:text-ink-700">
          <X className="size-4" />
        </button>
      </div>

      {translate.isPending ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-500">
          <Loader2 className="size-3 animate-spin" /> Đang dịch…
        </p>
      ) : null}

      <input
        value={meaning}
        onChange={(event) => {
          isPristine.current = false;
          setMeaning(event.target.value);
        }}
        placeholder="Nghĩa tiếng Việt"
        aria-label="Nghĩa tiếng Việt"
        className="mt-2 h-9 w-full rounded-lg border border-border-strong px-3 text-sm outline-none focus:border-brand-500"
      />
      {noTranslation ? (
        <p className="mt-1 text-xs text-ink-400">
          {isTranslationMock ? "Dịch tự động chưa sẵn sàng — hãy nhập nghĩa của bạn." : "Chưa có bản dịch — hãy nhập nghĩa của bạn."}
        </p>
      ) : null}
      {save.isError ? <p role="alert" className="mt-1 text-xs text-danger-text">Không lưu được, vui lòng thử lại.</p> : null}

      <Button size="sm" className="mt-2 w-full" disabled={!meaning.trim() || save.isPending || save.isSuccess} onClick={() => save.mutate()}>
        {save.isSuccess ? (
          <>
            <BookmarkCheck className="size-4" /> Đã lưu vào sổ
          </>
        ) : (
          "Lưu vào sổ"
        )}
      </Button>
    </div>
  );
}
