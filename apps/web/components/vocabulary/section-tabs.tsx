"use client";

import { cn } from "@/lib/cn";

const tabs = [
  { id: "suggested", label: "Từ vựng gợi ý" },
  { id: "saved", label: "Từ vựng đã lưu" },
] as const;

export type VocabularyTabId = (typeof tabs)[number]["id"];

interface SectionTabsProps {
  activeTabId: VocabularyTabId;
  onChange: (tabId: VocabularyTabId) => void;
}

export function SectionTabs({ activeTabId, onChange }: SectionTabsProps) {
  return (
    <div className="flex gap-6 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "cursor-pointer border-b-2 pb-3 text-sm font-semibold transition-colors",
            activeTabId === tab.id
              ? "border-brand-600 text-brand-700"
              : "border-transparent text-ink-400 hover:text-ink-700"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
