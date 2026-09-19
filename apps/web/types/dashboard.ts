export interface UserProfile {
  name: string;
  goalBand: number | null;
  examDateLabel: string | null;
  daysUntilExam: number | null;
  todayLabel: string;
}

export type SpeakingPartStatus = "done" | "active" | "locked";

export interface SpeakingPartStep {
  id: "part1" | "part2" | "part3";
  label: string;
  status: SpeakingPartStatus;
  band?: number;
  helperText?: string;
  tip: string;
}

export interface TodaySession {
  stage: number;
  totalStages: number;
  forecastLabel: string;
  estimatedMinutes: number;
  title: string;
  description: string;
  parts: SpeakingPartStep[];
}

export interface TestScoreSummary {
  currentBand: number | null;
  previousDelta: number | null;
  fullTestsCompleted: number;
  fullTestsRequired: number;
  fullTestDurationMinutes: number;
  lastAttemptDate: string | null;
  lastAttemptBand: number | null;
}

export interface HeatmapDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  sessionCount: number;
}

export interface HeatmapMonthLabel {
  weekIndex: number;
  label: string;
}

export interface HeatmapData {
  monthLabels: HeatmapMonthLabel[];
  weekdayLabels: string[];
  weeks: HeatmapDay[][];
  totalDays: number;
  activeDays: number;
}

export interface WeekStreak {
  currentStreak: number;
  recordStreak: number;
}

export type ForecastTagVariant = "hot" | "neutral" | "warning";

export interface ForecastQuestion {
  id: string;
  tagLabel: string;
  tagVariant: ForecastTagVariant;
  part: string;
  title: string;
}

export interface VocabularyRelatedWord {
  word: string;
  category: string;
}

export interface VocabularyOfTheDay {
  word: string;
  phonetic: string | null;
  meaning: string;
  exampleSentence: string | null;
  highlightWord: string;
  relatedWords: VocabularyRelatedWord[];
}

export interface DashboardHomeData {
  user: UserProfile;
  todaySession: TodaySession;
  testScore: TestScoreSummary;
  heatmap: HeatmapData;
  weekStreak: WeekStreak;
  forecastQuestions: ForecastQuestion[];
  vocabulary: VocabularyOfTheDay | null;
}
