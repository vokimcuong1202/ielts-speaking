import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "full", label: "Full test" },
  { id: "part1", label: "Thi Part 1" },
  { id: "part2", label: "Thi Part 2" },
  { id: "part3", label: "Thi Part 3" },
] as const;

export function TestTypeTabs() {
  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.id}
          href={`/practice/setup?part=${tab.id}`}
          className={cn(
            "group flex cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
            tab.id === "full"
              ? "border-brand-600 bg-brand-600 text-white hover:border-brand-700 hover:bg-brand-700"
              : "border-border-strong text-ink-700 hover:border-brand-400 hover:bg-page"
          )}
        >
          {tab.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </Link>
      ))}
    </div>
  );
}
