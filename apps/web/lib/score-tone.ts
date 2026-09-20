export type ScoreTone = "low" | "mid" | "good" | "high";

// Shared IELTS-style band color rule, reused anywhere a numeric score (band, skill, etc.) needs a tone.
// under 5.5 = grey, 5.5-6.0 = orange, 6.5-7.0 = medium green, 7.5+ = dark green.
export const SCORE_TONE_MID_MIN = 5.5;
export const SCORE_TONE_GOOD_MIN = 6.5;
export const SCORE_TONE_HIGH_MIN = 7.5;

export function getScoreTone(score: number): ScoreTone {
  if (score >= SCORE_TONE_HIGH_MIN) return "high";
  if (score >= SCORE_TONE_GOOD_MIN) return "good";
  if (score >= SCORE_TONE_MID_MIN) return "mid";
  return "low";
}

export const SCORE_TONE_BG_CLASS: Record<ScoreTone, string> = {
  low: "bg-score-low",
  mid: "bg-score-mid",
  good: "bg-score-good",
  high: "bg-score-high",
};

export const SCORE_TONE_TEXT_CLASS: Record<ScoreTone, string> = {
  low: "text-score-low",
  mid: "text-score-mid",
  good: "text-score-good",
  high: "text-score-high",
};

// Light pill fills for the same tones (e.g. skill-score tags) — matches components/ui/badge.tsx variants.
export const SCORE_TONE_BADGE_VARIANT: Record<ScoreTone, "scoreLow" | "scoreMid" | "scoreGood" | "scoreHigh"> = {
  low: "scoreLow",
  mid: "scoreMid",
  good: "scoreGood",
  high: "scoreHigh",
};
