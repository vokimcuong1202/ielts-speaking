export type ScoreTone = "low" | "mid" | "high";

// Shared IELTS-style score color rule, reused anywhere a numeric score (band, skill, etc.) needs a tone.
export const SCORE_TONE_MID_MIN = 5;
export const SCORE_TONE_HIGH_MIN = 7;

export function getScoreTone(score: number): ScoreTone {
  if (score >= SCORE_TONE_HIGH_MIN) return "high";
  if (score >= SCORE_TONE_MID_MIN) return "mid";
  return "low";
}

export const SCORE_TONE_BG_CLASS: Record<ScoreTone, string> = {
  low: "bg-score-low",
  mid: "bg-score-mid",
  high: "bg-score-high",
};

export const SCORE_TONE_TEXT_CLASS: Record<ScoreTone, string> = {
  low: "text-score-low",
  mid: "text-score-mid",
  high: "text-score-high",
};

// Light pill fills for the same tones (e.g. skill-score tags) — matches components/ui/badge.tsx variants.
export const SCORE_TONE_BADGE_VARIANT: Record<ScoreTone, "scoreLow" | "scoreMid" | "scoreHigh"> = {
  low: "scoreLow",
  mid: "scoreMid",
  high: "scoreHigh",
};
