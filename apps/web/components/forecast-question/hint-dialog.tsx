"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface HintDialogProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function HintDialog({ title, onClose, children }: HintDialogProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 p-4 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[80vh] w-full max-w-lg flex-col rounded-2xl bg-surface shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-lg font-bold text-ink-900">{title}</h2>
          <button type="button" aria-label="Đóng" onClick={onClose} className="cursor-pointer rounded-full p-1 text-ink-500 hover:bg-page">
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
