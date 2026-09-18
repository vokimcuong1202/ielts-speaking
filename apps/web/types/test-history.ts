export type TestType = "part1" | "part2" | "part3" | "full";

export interface TestActivityDay {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface TestActivityMonthLabel {
  weekIndex: number;
  label: string;
}

export interface TestActivitySummary {
  monthLabels: TestActivityMonthLabel[];
  weeks: TestActivityDay[][];
  totalAttempts: number;
  bestBand: number;
}

export interface SkillScores {
  fluency: number;
  vocabulary: number;
  grammar: number;
  pronunciation: number;
}

export type TranscriptSegment =
  | { kind: "text"; content: string }
  | { kind: "diff"; remove?: string; add?: string };

export type QuestionReviewContent =
  | { kind: "transcript"; segments: TranscriptSegment[] }
  | { kind: "shortAnswer"; quote: string; explanation: string };

export interface QuestionReview {
  id: string;
  index: number;
  question: string;
  isWeakest?: boolean;
  band?: number;
  skills?: SkillScores;
  content: QuestionReviewContent;
  feedback?: string;
}

export interface AttemptDetail {
  durationLabel?: string;
  note?: string;
  questions: QuestionReview[];
}

export type AttemptStatus = "invalid" | "grading" | "completed";

export interface TestAttempt {
  id: string;
  testType: TestType;
  title: string;
  status: AttemptStatus;
  timestamp: string;
  retryCount?: number;
  summary: string;
  gradingPercent?: number;
  band?: number;
  deltaFromFirstAttempt?: number;
  skills?: SkillScores;
  detail?: AttemptDetail;
  expandLabel?: string;
  collapseLabel?: string;
}

export interface TestHistoryData {
  activity: TestActivitySummary;
  attempts: TestAttempt[];
  totalAttemptsOlder: number;
}
