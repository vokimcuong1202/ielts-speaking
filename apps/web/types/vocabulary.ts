export type VocabularySourceType = "forecast" | "test";

export type VocabularyWordCategory = "collocation" | "idiom" | "phrasalVerb";

export interface VocabularyWordEntry {
  id: string;
  category: VocabularyWordCategory;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
}

export type VocabularyTopicWordEntry = VocabularyWordEntry;

export interface VocabularyGroup {
  id: string;
  sourceType: VocabularySourceType;
  question: string;
  dateLabel: string;
  partLabel: string;
  words: VocabularyWordEntry[];
}

export interface VocabularyReviewSummary {
  dueTodayCount: number;
  quickReviewMinutes: number;
}

export interface VocabularyFilterCounts {
  all: number;
  needsReview: number;
  mastered: number;
}

export interface VocabularyTopic {
  id: string;
  titleEn: string;
  titleVi: string;
  totalWords: number;
  masteredWords: number;
}

export interface VocabularyTopicOverview {
  masteredCount: number;
  totalCount: number;
  topicCount: number;
}

export interface VocabularyNotebookData {
  reviewSummary: VocabularyReviewSummary;
  filterCounts: VocabularyFilterCounts;
  groups: VocabularyGroup[];
  remainingGroupsCount: number;
  topicOverview: VocabularyTopicOverview;
  topics: VocabularyTopic[];
}

export interface VocabularyTopicCategoryCounts {
  collocation: number;
  idiom: number;
  phrasalVerb: number;
  unsaved: number;
}

export interface VocabularyTopicDetail {
  id: string;
  titleEn: string;
  titleVi: string;
  totalWords: number;
  masteredWords: number;
  hotPartsLabel: string;
  categoryCounts: VocabularyTopicCategoryCounts;
  words: VocabularyTopicWordEntry[];
}

export interface VocabularyReviewWord {
  id: string;
  categoryLabel: string;
  word: string;
  phonetic: string;
  meaning: string;
  example?: string;
}

export interface VocabularyReviewSession {
  scopeLabel: string;
  contextBadgeLabel?: string;
  contextBadgeVariant?: "brand" | "neutral";
  contextText?: string;
  words: VocabularyReviewWord[];
}
