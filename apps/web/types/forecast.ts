export type ForecastPartId = "part1" | "part2" | "part3";

export interface ForecastPartTab {
  id: ForecastPartId;
  label: string;
  count: number;
}

export interface ForecastQuarterInfo {
  title: string;
  rangeLabel: string;
  description: string;
}

export interface ForecastQuarterProgress {
  practicedCount: number;
  totalCount: number;
  averageBand: number;
  hotUnpracticedCount: number;
}

export type ForecastCardTag = "hayRa" | "moiVaoBo";

export type ForecastPracticeState =
  | { kind: "not-practiced" }
  | { kind: "practiced"; band: number };

export interface ForecastQuestionCard {
  id: string;
  part: ForecastPartId;
  tag?: ForecastCardTag;
  category: string;
  title: string;
  occurrenceCount: number;
  occurrenceWindowDays: number;
  extraMetaLabel?: string;
  practice: ForecastPracticeState;
}

export interface ForecastOutlineStep {
  order: number;
  leadIn: string;
  example?: string;
  note?: string;
}

export interface ForecastQuestionDetail {
  questionId: string;
  part: ForecastPartId;
  tag?: ForecastCardTag;
  title: string;
  prompts: string[];
  prepMinutes: number;
  speakMinutes: number;
  outlineSteps: ForecastOutlineStep[];
  vocabulary: string[];
  followUpQuestions: string[];
}

export interface ForecastPracticeData {
  quarter: ForecastQuarterInfo;
  progress: ForecastQuarterProgress;
  parts: ForecastPartTab[];
  questions: ForecastQuestionCard[];
  remainingCount: number;
  questionDetails: Record<string, ForecastQuestionDetail>;
}
