import { TopicWordCard } from "./topic-word-card";
import type { VocabularyTopicWordEntry, VocabularyWordCategory } from "@/types/vocabulary";

const categoryLabels: Record<VocabularyWordCategory, string> = {
  collocation: "Collocations",
  idiom: "Idioms",
  phrasalVerb: "Phrasal verbs",
};

export function TopicWordSection({
  category,
  count,
  words,
}: {
  category: VocabularyWordCategory;
  count: number;
  words: VocabularyTopicWordEntry[];
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-base font-bold text-ink-900">{categoryLabels[category]}</h2>
        <span className="text-sm text-ink-400">{count} từ</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
        {words.map((word) => (
          <TopicWordCard key={word.id} word={word} />
        ))}
      </div>
    </div>
  );
}
