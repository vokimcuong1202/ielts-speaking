"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "full", label: "Full test" },
  { id: "part1", label: "Thi Part 1" },
  { id: "part2", label: "Thi Part 2" },
  { id: "part3", label: "Thi Part 3" },
] as const;

export function TestTypeTabs() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("full");

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTab(tab.id)}
          className={cn(
            "cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
            activeTab === tab.id ? "bg-brand-500 text-white" : "border border-border-strong text-ink-700 hover:bg-page"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
