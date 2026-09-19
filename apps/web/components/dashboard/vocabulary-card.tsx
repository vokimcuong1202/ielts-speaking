import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { VocabularyOfTheDay } from "@/types/dashboard";

function HighlightedExample({ sentence, highlight }: { sentence: string; highlight: string }) {
  const index = sentence.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) return <>{sentence}</>;

  return (
    <>
      {sentence.slice(0, index)}
      <span className="font-semibold text-ink-900">{sentence.slice(index, index + highlight.length)}</span>
      {sentence.slice(index + highlight.length)}
    </>
  );
}

export function VocabularyCard({ vocabulary }: { vocabulary: VocabularyOfTheDay }) {
  return (
    <Card className="flex w-full flex-col p-6 lg:w-80">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-ink-900">Từ vựng hôm nay</h3>
        <a href="#" className="text-sm font-medium text-ink-400 hover:text-ink-700">
          Sổ từ
        </a>
      </div>

      <div className="mt-4 rounded-xl bg-brand-50 p-4">
        <p className="text-lg font-bold text-brand-800">
          {vocabulary.word}{" "}
          {vocabulary.phonetic && <span className="text-sm font-normal text-ink-500">{vocabulary.phonetic}</span>}
        </p>
        <p className="mt-1.5 text-sm text-ink-700">
          {vocabulary.meaning}
          {vocabulary.exampleSentence && (
            <>
              {" "}
              — &ldquo;
              <HighlightedExample sentence={vocabulary.exampleSentence} highlight={vocabulary.highlightWord} />
              &rdquo;
            </>
          )}
        </p>
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-2.5">
        {vocabulary.relatedWords.map((related) => (
          <li key={related.word} className="flex items-center justify-between gap-2 text-sm">
            <span className="flex items-center gap-2 text-ink-700">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
              {related.word}
            </span>
            <span className="shrink-0 text-xs text-ink-400">{related.category}</span>
          </li>
        ))}
      </ul>

      <Button variant="secondary" size="md" className="mt-4 w-full">
        Luyện {vocabulary.relatedWords.length} từ này trong câu nói
      </Button>
    </Card>
  );
}
