import { BarChart3, Headphones, PenLine, Timer } from "lucide-react";
import type { PracticeSetupIcon, PracticeSetupInfoItem as PracticeSetupInfoItemData } from "@/types/practice-setup";

const iconComponents: Record<PracticeSetupIcon, typeof Headphones> = {
  headphones: Headphones,
  timer: Timer,
  chart: BarChart3,
  pen: PenLine,
};

export function PracticeSetupInfoItem({ item }: { item: PracticeSetupInfoItemData }) {
  const Icon = iconComponents[item.icon];

  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
        <Icon className="h-4.5 w-4.5" strokeWidth={2} />
      </span>
      <div>
        <p className="text-sm font-bold text-white">{item.title}</p>
        <p className="mt-0.5 text-sm text-white/60">{item.description}</p>
      </div>
    </div>
  );
}
