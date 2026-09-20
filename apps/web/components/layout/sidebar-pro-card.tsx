import { ArrowRight, Sparkles } from "lucide-react";

export function SidebarProCard() {
  return (
    <div className="rounded-xl bg-brand-50 p-3">
      <p className="flex items-center gap-1.5 text-sm font-bold text-ink-900">
        <Sparkles className="h-4 w-4 text-brand-500" fill="currentColor" strokeWidth={0} />
        Gói Pro
      </p>
      <p className="mt-0.5 text-xs text-ink-500">Nói không giới hạn mỗi ngày</p>
      <button
        type="button"
        className="group relative mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-brand-500 via-brand-600 to-brand-800 text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(36,104,108,0.7)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-6px_rgba(36,104,108,0.85)] active:translate-y-0"
      >
        <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/25 transition-all duration-700 group-hover:left-[150%]" />
        <Sparkles className="h-4 w-4" fill="currentColor" strokeWidth={0} />
        Nâng cấp
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
