export function ForecastTopicVocabularyFooter({ words }: { words: string[] }) {
  if (words.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
      {words.map((word) => (
        <span key={word} className="rounded-full border border-border-strong bg-page px-3 py-1.5 text-sm text-ink-700">
          {word}
        </span>
      ))}

      <a href="#" className="ml-auto shrink-0 text-sm font-semibold text-brand-700 hover:underline">
        Lưu cả {words.length} vào sổ →
      </a>
    </div>
  );
}
