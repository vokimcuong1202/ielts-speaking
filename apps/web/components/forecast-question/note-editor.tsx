"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const MAX_LENGTH = 2000;

interface NoteEditorProps {
  initialBody: string;
  hasSavedNote: boolean;
  isSaving: boolean;
  onSave: (body: string) => void;
  onDelete: () => void;
}

/** Textarea for "Ghi chú – tạo câu mẫu của riêng bạn". */
export function NoteEditor({ initialBody, hasSavedNote, isSaving, onSave, onDelete }: NoteEditorProps) {
  const [body, setBody] = useState(initialBody);
  const isDirty = body.trim() !== initialBody.trim();

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-3">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        maxLength={MAX_LENGTH}
        rows={4}
        placeholder="Viết câu trả lời mẫu của riêng bạn cho câu hỏi này…"
        aria-label="Ghi chú câu mẫu của bạn"
        className="w-full resize-y rounded-xl border border-border-strong p-3 text-sm leading-6 outline-none focus:border-brand-500"
      />
      <div className="flex items-center gap-2">
        <Button size="sm" disabled={!body.trim() || !isDirty || isSaving} onClick={() => onSave(body)}>
          {isSaving ? "Đang lưu…" : hasSavedNote && !isDirty ? "Đã lưu" : "Lưu ghi chú"}
        </Button>
        {hasSavedNote ? (
          <button type="button" onClick={onDelete} className="cursor-pointer text-sm text-ink-400 hover:text-danger-text">
            Xoá ghi chú
          </button>
        ) : null}
        <span className="ml-auto text-xs text-ink-400 tabular-nums">
          {body.length}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
