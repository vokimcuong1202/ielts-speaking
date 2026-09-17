import { ChevronDown } from "lucide-react";

export function SidebarUser({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <button className="flex w-full items-center gap-2.5 rounded-xl px-1 py-1.5 text-left hover:bg-page">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
        {initial}
      </span>
      <span className="flex-1 text-sm font-semibold text-ink-900">{name}</span>
      <ChevronDown className="h-4 w-4 text-ink-400" />
    </button>
  );
}
