import { SrsRating, SrsState } from "../../../../../database/generated/client";

export interface SrsCard {
  ease: number;
  intervalDays: number;
  reps: number;
  lapses: number;
}

export interface SrsResult extends SrsCard {
  state: SrsState;
}

const MIN_EASE = 1.3;
const MASTERED_AFTER_DAYS = 21;

/**
 * SM-2 flavoured scheduler for the four buttons on the flashcard (again / hard / good / easy).
 * Pure so it can be unit-tested; the caller turns intervalDays into user_vocab.due_on.
 */
export function schedule(card: SrsCard, rating: SrsRating): SrsResult {
  let { ease, intervalDays, reps, lapses } = card;

  switch (rating) {
    case "again":
      lapses += 1;
      reps = 0;
      intervalDays = 1;
      ease = Math.max(MIN_EASE, ease - 0.2);
      break;
    case "hard":
      reps += 1;
      intervalDays = Math.max(1, Math.round(Math.max(intervalDays, 1) * 1.2));
      ease = Math.max(MIN_EASE, ease - 0.15);
      break;
    case "good":
      reps += 1;
      intervalDays = reps === 1 ? 1 : reps === 2 ? 3 : Math.round(intervalDays * ease);
      break;
    case "easy":
      reps += 1;
      intervalDays = reps === 1 ? 4 : Math.max(4, Math.round(Math.max(intervalDays, 1) * ease * 1.3));
      ease += 0.15;
      break;
  }

  const state: SrsState = rating === "again" || reps === 0 ? "learning" : intervalDays >= MASTERED_AFTER_DAYS ? "mastered" : "review";
  return { ease: Math.round(ease * 100) / 100, intervalDays, reps, lapses, state };
}

export const isKnown = (rating: SrsRating) => rating === "good" || rating === "easy";
