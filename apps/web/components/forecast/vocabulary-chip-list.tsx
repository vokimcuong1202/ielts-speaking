export function VocabularyChipList({ words }: { words: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {words.map((word) => (
        <span key={word} className="rounded-full border border-border-strong bg-surface px-3 py-1.5 text-sm text-ink-700">
          {word}
        </span>
      ))}
    </div>
  );
}
