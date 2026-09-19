import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SpeakingPartStep } from "@/types/dashboard";

const stepNumber: Record<SpeakingPartStep["id"], number> = {
  part1: 1,
  part2: 2,
  part3: 3,
};

const setupLinkablePartIds: SpeakingPartStep["id"][] = ["part1", "part2", "part3"];

export function PartStep({
  step,
  onHoverChange,
}: {
  step: SpeakingPartStep;
  onHoverChange?: (active: boolean) => void;
}) {
  const isActive = step.status === "active";
  const isDone = step.status === "done";
  const isLinkable = setupLinkablePartIds.includes(step.id);

  const hoverProps = onHoverChange && {
    onMouseEnter: () => onHoverChange(true),
    onMouseLeave: () => onHoverChange(false),
    onFocus: () => onHoverChange(true),
    onBlur: () => onHoverChange(false),
  };

  const card = (
    <div
      {...hoverProps}
      className={cn(
        "flex flex-1 items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
        isActive && "border-brand-600 bg-brand-600",
        isDone && "border-border bg-surface",
        step.status === "locked" && "border-border bg-page",
        isLinkable && "cursor-pointer hover:border-brand-400"
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
          isActive && "bg-white/20 text-white",
          isDone && "bg-success-bg text-success-text",
          step.status === "locked" && "bg-border text-ink-400"
        )}
      >
        {isDone ? <Check className="h-4 w-4" strokeWidth={3} /> : stepNumber[step.id]}
      </span>
      <div className="leading-tight">
        <p className={cn("text-sm font-bold", isActive ? "text-white" : "text-ink-900")}>{step.label}</p>
        <p className={cn("text-xs", isActive ? "text-white/80" : "text-ink-500")}>
          {step.band ? `band ${step.band.toFixed(1)}` : step.helperText}
        </p>
      </div>
    </div>
  );

  if (isLinkable) {
    return (
      <Link href={`/practice/setup?part=${step.id}`} className="contents">
        {card}
      </Link>
    );
  }

  return card;
}
