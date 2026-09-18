import type { ForecastOutlineStep } from "@/types/forecast";

export function SuggestedOutlineList({ steps }: { steps: ForecastOutlineStep[] }) {
  return (
    <ol className="mt-2 flex flex-col gap-3">
      {steps.map((step) => (
        <li key={step.order} className="flex gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
            {step.order}
          </span>
          <p className="text-sm leading-relaxed text-ink-700">
            {step.leadIn}
            {step.example ? (
              <>
                {" "}
                <span className="italic">{step.example}</span>
              </>
            ) : null}
            {step.note ? <> {step.note}</> : null}
          </p>
        </li>
      ))}
    </ol>
  );
}
