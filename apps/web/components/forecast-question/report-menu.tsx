"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { AttemptReportReason } from "@/types/forecast-question";

const REASONS: { id: AttemptReportReason; label: string }[] = [
  { id: "transcript_wrong", label: "Bản ghi chép sai" },
  { id: "score_wrong", label: "Điểm chưa hợp lý" },
  { id: "audio_problem", label: "Lỗi âm thanh" },
  { id: "other", label: "Lý do khác" },
];

interface ReportMenuProps {
  onReport: (reason: AttemptReportReason) => Promise<unknown>;
}

/** "Báo lỗi" link that opens a small reason picker. */
export function ReportMenu({ onReport }: ReportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  async function report(reason: AttemptReportReason) {
    setStatus("sending");
    try {
      await onReport(reason);
      setStatus("sent");
    } catch {
      setStatus("failed");
    }
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        disabled={status === "sending"}
        onClick={() => setIsOpen((value) => !value)}
        className={cn(
          "cursor-pointer text-sm hover:text-ink-700",
          status === "sent" ? "text-success-text" : status === "failed" ? "text-danger-text" : "text-ink-400"
        )}
      >
        {status === "sent" ? "Đã gửi báo lỗi ✓" : status === "failed" ? "Gửi lỗi, thử lại" : "Báo lỗi"}
      </button>

      {isOpen ? (
        <div role="menu" className="absolute top-full right-0 z-20 mt-1 w-44 rounded-xl border border-border bg-surface p-1 shadow-[var(--shadow-card)]">
          {REASONS.map((reason) => (
            <button
              key={reason.id}
              type="button"
              role="menuitem"
              onClick={() => report(reason.id)}
              className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-ink-700 hover:bg-page"
            >
              {reason.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
