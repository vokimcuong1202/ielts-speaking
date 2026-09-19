import { BandCriterion } from "../../../../../database/generated/client";

const DAY_MS = 86_400_000;

export interface StreakState {
  currentDays: number;
  longestDays: number;
  currentStartedOn: Date | null;
  lastActiveDay: Date | null;
}

/** Days are local-date values at UTC midnight (see common/utils/local-date). */
export function nextStreak(previous: StreakState | null, today: Date): StreakState {
  const last = previous?.lastActiveDay ?? null;
  if (last && last.getTime() === today.getTime()) return previous!;

  const continues = last !== null && today.getTime() - last.getTime() === DAY_MS;
  const currentDays = continues ? previous!.currentDays + 1 : 1;
  return {
    currentDays,
    longestDays: Math.max(previous?.longestDays ?? 0, currentDays),
    currentStartedOn: continues ? previous!.currentStartedOn : today,
    lastActiveDay: today,
  };
}

/** Heatmap tone, 0-4 (practice_days.intensity CHECK). */
export function heatmapIntensity(attemptsCount: number): number {
  if (attemptsCount <= 0) return 0;
  if (attemptsCount === 1) return 1;
  if (attemptsCount <= 3) return 2;
  if (attemptsCount <= 6) return 3;
  return 4;
}

const CRITERION_LABEL_VI: Record<BandCriterion, string> = {
  fluency: "Trôi chảy",
  lexical: "Từ vựng",
  grammar: "Ngữ pháp",
  pronunciation: "Phát âm",
};

/** The weakest criterion across recent scores -> user_stats "ĐIỂM NGHẼN". */
export function findBottleneck(scores: { criterion: BandCriterion; band: number }[]) {
  const sums = new Map<BandCriterion, { total: number; count: number }>();
  for (const { criterion, band } of scores) {
    const entry = sums.get(criterion) ?? { total: 0, count: 0 };
    entry.total += band;
    entry.count += 1;
    sums.set(criterion, entry);
  }
  let weakest: { criterion: BandCriterion; average: number } | null = null;
  for (const [criterion, { total, count }] of sums) {
    const average = total / count;
    if (!weakest || average < weakest.average) weakest = { criterion, average };
  }
  if (!weakest) return null;
  return {
    criterion: weakest.criterion,
    noteVi: `${CRITERION_LABEL_VI[weakest.criterion]} đang thấp nhất (trung bình ${weakest.average.toFixed(1)}) trong các lần luyện gần đây.`,
  };
}

export const round1 = (value: number) => Math.round(value * 10) / 10;
