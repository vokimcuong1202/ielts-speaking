import { Check } from "lucide-react";

interface PracticeSetupStatusCardProps {
  micReadyLabel: string;
  gradingCreditsRemaining: number;
}

export function PracticeSetupStatusCard({ micReadyLabel, gradingCreditsRemaining }: PracticeSetupStatusCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/5 px-4 py-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-text text-white">
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      <p className="text-sm text-white/80">
        {micReadyLabel} · Lượt chấm còn lại <span className="font-bold text-white">{gradingCreditsRemaining}</span>
      </p>
    </div>
  );
}
