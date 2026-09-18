import { PracticeSetupInfoItem } from "./practice-setup-info-item";
import { PracticeSetupStatusCard } from "./practice-setup-status-card";
import type { PracticeSetupConfig } from "@/types/practice-setup";

export function PracticeSetupSidebar({ config }: { config: PracticeSetupConfig }) {
  return (
    <div className="relative flex w-full shrink-0 flex-col justify-between overflow-hidden bg-ink-900 p-8 text-white sm:w-[320px] lg:w-[360px]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl"
      />

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-wide text-brand-300">{config.examBadgeLabel}</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight">{config.title}</h1>
        <p className="mt-3 text-sm text-white/60">{config.introDescription}</p>

        <div className="mt-8 flex flex-col gap-5">
          {config.infoItems.map((item) => (
            <PracticeSetupInfoItem key={item.title} item={item} />
          ))}
        </div>
      </div>

      <div className="relative mt-8">
        <PracticeSetupStatusCard
          micReadyLabel={config.micReadyLabel}
          gradingCreditsRemaining={config.gradingCreditsRemaining}
        />
      </div>
    </div>
  );
}
