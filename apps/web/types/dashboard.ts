export interface UserProfile {
  name: string;
  goalBand: number;
  examDateLabel: string;
  daysUntilExam: number;
  todayLabel: string;
}

export type SpeakingPartStatus = "done" | "active" | "locked";

export interface SpeakingPartStep {
  id: "part1" | "part2" | "part3";
  label: string;
  status: SpeakingPartStatus;
  band?: number;
  helperText?: string;
}

export interface TodaySession {
  stage: number;
  totalStages: number;
  forecastLabel: string;
  estimatedMinutes: number;
  title: string;
  description: string;
  tip: string;
  parts: SpeakingPartStep[];
}

export interface TestScoreSummary {
  currentBand: number;
  previousDelta: number;
  fullTestsCompleted: number;
  fullTestsRequired: number;
  fullTestDurationMinutes: number;
  lastAttemptDate: string;
  lastAttemptBand: number;
}

export interface HeatmapDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
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
  phonetic: string;
  meaning: string;
  exampleSentence: string;
  highlightWord: string;
  relatedWords: VocabularyRelatedWord[];
}

export interface SidebarProgress {
  completed: number;
  total: number;
}

export interface DashboardHomeData {
  user: UserProfile;
  todaySession: TodaySession;
  testScore: TestScoreSummary;
  heatmap: HeatmapData;
  weekStreak: WeekStreak;
  forecastQuestions: ForecastQuestion[];
  vocabulary: VocabularyOfTheDay;
  sidebarProgress: SidebarProgress;
}
