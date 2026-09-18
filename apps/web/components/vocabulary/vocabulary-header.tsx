import type { ReactNode } from "react";

interface VocabularyHeaderProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function VocabularyHeader({ title, description, children }: VocabularyHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-brand-600">Sổ từ vựng</p>
        <h1 className="mt-1 text-2xl font-extrabold text-ink-900 sm:text-3xl">{title}</h1>
        <p className="mt-1.5 max-w-2xl text-sm text-ink-500">{description}</p>
      </div>

      {children}
    </div>
  );
}
