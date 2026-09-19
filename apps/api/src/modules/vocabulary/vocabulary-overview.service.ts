import { Injectable } from "@nestjs/common";
import { localDate, localDateString } from "../../common/utils/local-date";
import { VocabularyRepository } from "./vocabulary.repository";
import { VocabularyOverviewQuery } from "./dto/vocabulary-overview.query";

type NotebookEntry = Awaited<ReturnType<VocabularyRepository["findNotebookEntries"]>>[number];

const DEFAULT_GROUP_LIMIT = 5;
const SECONDS_PER_CARD = 15;
const UNSORTED_GROUP_ID = "unsorted";

const CATEGORY_BY_KIND = {
  word: "collocation",
  collocation: "collocation",
  sentence_frame: "collocation",
  idiom: "idiom",
  phrasal_verb: "phrasalVerb",
} as const;

const PART_LABEL = { part1: "Part 1", part2: "Part 2", part3: "Part 3" } as const;

@Injectable()
export class VocabularyOverviewService {
  constructor(private readonly vocabularyRepository: VocabularyRepository) {}

  /** Everything the "Sổ từ vựng" page renders, in the shape of web `VocabularyNotebookData`. */
  async getOverview(userId: string, query: VocabularyOverviewQuery) {
    const timezone = await this.vocabularyRepository.findTimezone(userId);
    const today = localDate(timezone);
    const [entries, topics] = await Promise.all([
      this.vocabularyRepository.findNotebookEntries(userId),
      this.vocabularyRepository.findTopics(),
    ]);

    const isDue = (entry: NotebookEntry) => entry.state !== "suspended" && entry.dueOn <= today;
    const isMastered = (entry: NotebookEntry) => entry.state === "mastered";
    const dueTodayCount = entries.filter(isDue).length;

    const status = query.status ?? "all";
    const visible = entries.filter((entry) =>
      status === "needsReview" ? isDue(entry) : status === "mastered" ? isMastered(entry) : true,
    );
    const groups = this.buildGroups(visible, timezone);
    const groupLimit = query.groupLimit ?? DEFAULT_GROUP_LIMIT;

    const masteredByTopic = new Map<string, number>();
    for (const entry of entries.filter(isMastered)) {
      const topicId = entry.vocabItem.topicId?.toString();
      if (topicId) masteredByTopic.set(topicId, (masteredByTopic.get(topicId) ?? 0) + 1);
    }
    const topicCards = topics.map((topic) => ({
      id: topic.id.toString(),
      titleEn: topic.nameEn,
      titleVi: topic.nameVi ?? topic.nameEn,
      totalWords: topic._count.vocabItems,
      masteredWords: masteredByTopic.get(topic.id.toString()) ?? 0,
    }));

    return {
      reviewSummary: {
        dueTodayCount,
        quickReviewMinutes: dueTodayCount === 0 ? 0 : Math.max(1, Math.ceil((dueTodayCount * SECONDS_PER_CARD) / 60)),
      },
      filterCounts: {
        all: entries.length,
        needsReview: dueTodayCount,
        mastered: entries.filter(isMastered).length,
      },
      groups: groups.slice(0, groupLimit),
      remainingGroupsCount: Math.max(0, groups.length - groupLimit),
      topicOverview: {
        masteredCount: topicCards.reduce((sum, topic) => sum + topic.masteredWords, 0),
        totalCount: topicCards.reduce((sum, topic) => sum + topic.totalWords, 0),
        topicCount: topicCards.length,
      },
      topics: topicCards,
    };
  }

  /** One group per question the words were saved from, most recently saved first. */
  private buildGroups(entries: NotebookEntry[], timezone: string) {
    const groups = new Map<string, NotebookEntry[]>();
    for (const entry of entries) {
      const key = entry.sourceQuestionId?.toString() ?? UNSORTED_GROUP_ID;
      groups.set(key, [...(groups.get(key) ?? []), entry]);
    }

    return [...groups.entries()].map(([id, words]) => {
      const latest = words[0]; // entries arrive ordered by savedAt desc
      const question = latest.question;
      return {
        id,
        sourceType: words.some((word) => word.source === "mock_feedback") ? ("test" as const) : ("forecast" as const),
        question: question?.textEn ?? "Từ vựng lưu thêm",
        dateLabel: this.dateLabel(latest.savedAt, timezone),
        partLabel: question ? PART_LABEL[question.part] : "",
        words: words.map((word) => ({
          id: word.id.toString(),
          userVocabId: word.id.toString(),
          vocabItemId: word.vocabItemId.toString(),
          category: CATEGORY_BY_KIND[word.vocabItem.kind],
          word: word.vocabItem.term,
          phonetic: word.vocabItem.ipa ?? "",
          meaning: word.vocabItem.meaningVi,
          example: word.vocabItem.exampleEn ?? "",
          state: word.state,
        })),
      };
    });
  }

  /** "dd/MM" in the user's timezone. */
  private dateLabel(date: Date, timezone: string) {
    const [, month, day] = localDateString(timezone, date).split("-");
    return `${day}/${month}`;
  }
}
