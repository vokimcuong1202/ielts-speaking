import type { VocabularyWordCategory, VocabularyWordEntry, VocabularyReviewWord } from "@/types/vocabulary";

const categoryLabels: Record<VocabularyWordCategory, string> = {
  collocation: "Collocation",
  idiom: "Idiom",
  phrasalVerb: "Phrasal verb",
};

export function toReviewWords(entries: VocabularyWordEntry[]): VocabularyReviewWord[] {
  return entries.map((entry) => ({
    id: entry.id,
    categoryLabel: categoryLabels[entry.category],
    word: entry.word,
    phonetic: entry.phonetic,
    meaning: entry.meaning,
    example: entry.example,
  }));
}
