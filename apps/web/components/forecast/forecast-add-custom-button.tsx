import { Plus } from "lucide-react";

export function ForecastAddCustomButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-dashed border-border-strong px-4 py-3 text-sm font-semibold text-ink-500 hover:border-brand-300 hover:text-brand-700"
    >
      <Plus className="h-4 w-4" strokeWidth={2.5} />
      {label}
    </button>
  );
}
