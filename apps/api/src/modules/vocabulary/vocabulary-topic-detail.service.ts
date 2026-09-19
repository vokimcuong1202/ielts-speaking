import { Injectable, NotFoundException } from "@nestjs/common";
import { VocabularyRepository } from "./vocabulary.repository";

const CATEGORY_BY_KIND = {
  word: "collocation",
  collocation: "collocation",
  sentence_frame: "collocation",
  idiom: "idiom",
  phrasal_verb: "phrasalVerb",
} as const;

const PART_NUMBER = { part1: "Part 1", part2: "Part 2", part3: "Part 3" } as const;

@Injectable()
export class VocabularyTopicDetailService {
  constructor(private readonly vocabularyRepository: VocabularyRepository) {}

  /** Everything the topic page (`/vocabulary/:topicId`) renders, in the shape of web `VocabularyTopicDetail`. */
  async getDetail(userId: string, id: bigint) {
    const topic = await this.vocabularyRepository.findTopicWithItems(id, {});
    if (!topic) throw new NotFoundException("Vocabulary topic not found");

    const saved = await this.vocabularyRepository.findSavedItemIds(
      userId,
      topic.vocabItems.map((item) => item.id),
    );
    const savedByItem = new Map(saved.map((row) => [row.vocabItemId, row]));

    const words = topic.vocabItems.map((item) => ({
      id: item.id.toString(),
      userVocabId: savedByItem.get(item.id)?.id.toString() ?? null,
      saved: savedByItem.has(item.id),
      category: CATEGORY_BY_KIND[item.kind],
      word: item.term,
      phonetic: item.ipa ?? "",
      meaning: item.meaningVi,
      example: item.exampleEn ?? "",
    }));
    const countOf = (category: (typeof words)[number]["category"]) =>
      words.filter((word) => word.category === category).length;

    return {
      id: topic.id.toString(),
      titleEn: topic.nameEn,
      titleVi: topic.nameVi ?? topic.nameEn,
      totalWords: words.length,
      masteredWords: saved.filter((row) => row.state === "mastered").length,
      hotPartsLabel: this.hotPartsLabel(topic.commonParts),
      categoryCounts: {
        collocation: countOf("collocation"),
        idiom: countOf("idiom"),
        phrasalVerb: countOf("phrasalVerb"),
        unsaved: words.filter((word) => !word.saved).length,
      },
      words,
    };
  }

  /** "hay ra ở Part 1 và Part 3" */
  private hotPartsLabel(parts: (keyof typeof PART_NUMBER)[]) {
    const labels = parts.map((part) => PART_NUMBER[part]);
    if (labels.length === 0) return "";
    if (labels.length === 1) return `hay ra ở ${labels[0]}`;
    return `hay ra ở ${labels.slice(0, -1).join(", ")} và ${labels[labels.length - 1]}`;
  }
}
