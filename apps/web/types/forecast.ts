export type ForecastPartId = "part1" | "part2" | "part3" | "custom";

export interface ForecastPartTab {
  id: ForecastPartId;
  label: string;
  count: number;
}

export type ForecastQuestionStatus = "new" | "unanswered" | "answered";

export type ForecastSortId = "newestTopic" | "probability" | "unpracticed";

export interface ForecastSortOption {
  id: ForecastSortId;
  label: string;
}

export type ForecastBadgeVariant = "brand" | "warning" | "neutral" | "outline";

export interface ForecastBadge {
  label: string;
  variant: ForecastBadgeVariant;
}

// Part 1 — flat topic list, 4 questions per topic
export interface ForecastTopicQuestion {
  id: string;
  title: string;
  status: ForecastQuestionStatus;
}

export interface ForecastTopicPracticeSummary {
  answeredCount: number;
  totalCount: number;
  lastPracticedLabel: string;
  lowestScoreQuestionTitle: string;
  latestBand: number;
}

export interface ForecastTopic {
  id: string;
  name: string;
  isNewTopic: boolean;
  hasNewQuestions: boolean;
  addedDateLabel?: string;
  questions: ForecastTopicQuestion[];
  vocabulary: string[];
  practiceSummary?: ForecastTopicPracticeSummary;
}

export interface ForecastPart1Data {
  pageTitle: string;
  hideAnsweredLabel: string;
  sortOptions: ForecastSortOption[];
  topics: ForecastTopic[];
}

// Shared by Part 2 & Part 3 — topics are organised into groups (Người / Vật / Hoạt động / Địa điểm)
export interface ForecastGroup {
  id: string;
  label: string;
  badge?: ForecastBadge;
  unitCount: number;
  unitLabel: string;
  practicedCount: number;
  progressLabel: string;
}

// Part 2 — one cue card per topic
export interface ForecastCueCard {
  id: string;
  groupId: string;
  tag?: ForecastBadge;
  title: string;
  prompts: string[];
  prepMinutes: number;
  speakMinutes: number;
  vocabulary: string[];
  followUpCount: number;
  sidebarMetaLabel: string;
  rowMetaLabel: string;
  statusLabel: string;
  practiceSummary?: { practicedCount: number; latestBand: number };
}

export interface ForecastPart2Data {
  pageTitle: string;
  hideAnsweredLabel: string;
  groups: ForecastGroup[];
  cueCardsByGroup: Record<string, ForecastCueCard[]>;
}

// Part 3 — clusters of follow-up questions linked back to a Part 2 cue card
export interface ForecastFollowUpQuestion {
  id: string;
  title: string;
  status: ForecastQuestionStatus;
}

export interface ForecastFollowUpCluster {
  id: string;
  groupId: string;
  sourceTitle: string;
  questions: ForecastFollowUpQuestion[];
  sidebarBadge?: ForecastBadge;
  sidebarMetaLabel: string;
  tipText?: string;
  practiceSummary?: ForecastTopicPracticeSummary;
}

export interface ForecastPart3Data {
  pageTitle: string;
  hideAnsweredLabel: string;
  groups: ForecastGroup[];
  clustersByGroup: Record<string, ForecastFollowUpCluster[]>;
}

export interface ForecastPracticeData {
  quarterLabel: string;
  parts: ForecastPartTab[];
  part1: ForecastPart1Data;
  part2: ForecastPart2Data;
  part3: ForecastPart3Data;
  custom: ForecastPart1Data;
}
