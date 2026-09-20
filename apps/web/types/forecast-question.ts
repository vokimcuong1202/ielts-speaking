export type TranscriptSegmentKind = "plain" | "added" | "removed";

export interface TranscriptSegment {
  text: string;
  kind: TranscriptSegmentKind;
}

export interface QuestionSkillScore {
  id: string;
  label: string;
  score: number;
}

/** Anything but `scored` has no band, skills or rewrite yet (or ever). */
export type QuestionAttemptStatus = "scored" | "grading" | "invalid" | "failed";

export interface QuestionAttempt {
  id: string;
  index: number;
  status: QuestionAttemptStatus;
  dateLabel: string;
  durationLabel: string;
  band: number | null;
  skills: QuestionSkillScore[];
  transcript: TranscriptSegment[];
  shortened?: { text: string; highlight?: string; tip: string | null };
}

export interface QuestionVocabItem {
  id: string;
  phrase: string;
  ipa: string;
  meaning: string;
  example?: { en: string; highlight: string; vi: string };
  saved: boolean;
  /** Notebook entry id, needed to remove a saved word. */
  userVocabId: string | null;
}

export interface QuestionNavLink {
  /** Question slug, used in the page URL. */
  id: string;
  title: string;
}

export interface QuestionSampleAnswer {
  band: number;
  body: string;
  notes: string | null;
}

export type QuestionVocabBand = "6" | "7" | "8";

export interface ForecastQuestionPractice {
  id: string;
  slug: string;
  partId: string;
  partLabel: string;
  title: string;
  position: number;
  total: number;
  topicLabel: string;
  isBookmarked: boolean;
  /** null = unlimited plan */
  quota: { remainingToday: number | null };
  attempts: QuestionAttempt[];
  vocabularyByBand: Record<QuestionVocabBand, QuestionVocabItem[]>;
  ideaSteps: string[];
  sampleAnswers: QuestionSampleAnswer[];
  previous?: QuestionNavLink;
  next?: QuestionNavLink;
}

export type AttemptReportReason = "transcript_wrong" | "score_wrong" | "audio_problem" | "other";
