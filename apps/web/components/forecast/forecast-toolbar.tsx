"use client";

import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ForecastToolbarProps {
  hideAnswered: boolean;
  onHideAnsweredChange: (checked: boolean) => void;
  search: string;
  onSearchChange: (value: string) => void;
  hideAnsweredLabel: string;
}

export function ForecastToolbar({
  hideAnswered,
  onHideAnsweredChange,
  search,
  onSearchChange,
  hideAnsweredLabel,
}: ForecastToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Switch checked={hideAnswered} onCheckedChange={onHideAnsweredChange} label={hideAnsweredLabel} />

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400" strokeWidth={2} />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Tìm câu hỏi..."
          className="h-10 w-56 rounded-xl border border-border-strong bg-surface pr-3 pl-9 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
