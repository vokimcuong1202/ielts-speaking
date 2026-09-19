import { Injectable, NotFoundException } from "@nestjs/common";
import { addDays, localDate, localDateString, toDateOnly } from "../../common/utils/local-date";
import { VocabularyService } from "../vocabulary/vocabulary.service";
import { DashboardRepository } from "./dashboard.repository";

type Part = "part1" | "part2" | "part3";

const PARTS: { id: Part; label: string; tip: string }[] = [
  { id: "part1", label: "Part 1", tip: "Part 1: Câu hỏi cá nhân, trả lời 2-3 câu là đủ - tự nhiên hơn học thuộc." },
  { id: "part2", label: "Part 2", tip: "Part 2: 1 phút chuẩn bị, 2 phút nói — đúng nhịp phòng thi." },
  { id: "part3", label: "Part 3", tip: "Part 3: Nêu ý kiến rồi giải thích vì sao - giám khảo chấm lập luận." },
];

const WEEKDAY_VI = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
const HEATMAP_WEEKS = 22;
const FULL_TESTS_REQUIRED = 3;
const DEFAULT_FULL_TEST_MINUTES = 14;
const FORECAST_QUESTION_COUNT = 4;

const round1 = (value: number) => Math.round(value * 10) / 10;
const ddMm = (date: Date, timezone: string) => localDateString(timezone, date).slice(5).split("-").reverse().join("/");

@Injectable()
export class DashboardService {
  constructor(
    private readonly dashboardRepository: DashboardRepository,
    private readonly vocabularyService: VocabularyService,
  ) {}

  /** Everything the dashboard page renders, in the shape of web `DashboardHomeData`. */
  async getHome(userId: string) {
    const user = await this.dashboardRepository.findUser(userId);
    if (!user) throw new NotFoundException("User not found");

    const now = new Date();
    const today = localDate(user.timezone, now);

    const [attempts, mockTests, mockTestCount, days, forecastSet, dailyPicks] = await Promise.all([
      this.dashboardRepository.findScoredAttemptsSince(userId, new Date(now.getTime() - 36 * 3_600_000)),
      this.dashboardRepository.findLatestScoredMockTests(userId, 2),
      this.dashboardRepository.countScoredMockTests(userId),
      this.dashboardRepository.findPracticeDays(userId, this.heatmapStart(today), today),
      this.dashboardRepository.findCurrentForecastSet(),
      this.vocabularyService.getDailyPicks(userId),
    ]);

    const forecastQuestions = forecastSet
      ? await this.dashboardRepository.findTopForecastQuestions(userId, forecastSet.id, FORECAST_QUESTION_COUNT)
      : [];

    const todayAttempts = attempts.filter(
      (attempt) => attempt.scoredAt && localDateString(user.timezone, attempt.scoredAt) === localDateString(user.timezone, now),
    );

    return {
      user: this.buildUser(user, today, now),
      todaySession: this.buildTodaySession(todayAttempts, forecastSet?.quarterLabel),
      testScore: this.buildTestScore(mockTests, mockTestCount, user.timezone),
      heatmap: this.buildHeatmap(days, today),
      weekStreak: {
        currentStreak: user.userStreak?.currentDays ?? 0,
        recordStreak: user.userStreak?.longestDays ?? 0,
      },
      forecastQuestions: forecastQuestions.map(({ flag, question }) => {
        const lastBand = question.userQuestionProgress[0]?.lastBand?.toNumber();
        const done = lastBand !== undefined;
        return {
          id: String(question.id),
          tagLabel: done ? `đã làm · ${lastBand.toFixed(1)}` : flag === "hot" ? "HOT" : (question.topicGroup?.nameEn ?? "Forecast"),
          tagVariant: done ? "warning" : flag === "hot" ? "hot" : "neutral",
          part: question.part.replace("part", "Part "),
          title: question.textEn,
        };
      }),
      vocabulary: this.buildVocabulary(dailyPicks),
    };
  }

  private buildUser(
    user: NonNullable<Awaited<ReturnType<DashboardRepository["findUser"]>>>,
    today: Date,
    now: Date,
  ) {
    const examDate = user.userGoal?.examDate ?? null;
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: user.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(now);

    return {
      name: user.displayName,
      goalBand: user.userGoal?.targetBand.toNumber() ?? null,
      examDateLabel: examDate ? `${String(examDate.getUTCDate()).padStart(2, "0")}/${String(examDate.getUTCMonth() + 1).padStart(2, "0")}` : null,
      daysUntilExam: examDate ? Math.max(0, Math.round((examDate.getTime() - today.getTime()) / 86_400_000)) : null,
      todayLabel: `${WEEKDAY_VI[today.getUTCDay()]}, ${String(today.getUTCDate()).padStart(2, "0")}/${String(today.getUTCMonth() + 1).padStart(2, "0")} · ${time}`,
    };
  }

  /** A part is done once the user has a scored attempt for it today; the first open part is active. */
  private buildTodaySession(
    todayAttempts: Awaited<ReturnType<DashboardRepository["findScoredAttemptsSince"]>>,
    quarterLabel?: string,
  ) {
    const bandsByPart = new Map<Part, number[]>();
    for (const { question, bandOverall } of todayAttempts) {
      if (bandOverall === null) continue;
      bandsByPart.set(question.part, [...(bandsByPart.get(question.part) ?? []), bandOverall.toNumber()]);
    }

    let activeAssigned = false;
    const parts = PARTS.map(({ id, label, tip }) => {
      const bands = bandsByPart.get(id);
      if (bands?.length) {
        return { id, label, status: "done" as const, band: round1(bands.reduce((a, b) => a + b, 0) / bands.length), tip };
      }
      if (!activeAssigned) {
        activeAssigned = true;
        return { id, label, status: "active" as const, helperText: "đang chờ bạn", tip };
      }
      return { id, label, status: "locked" as const, helperText: "chưa mở", tip };
    });

    const doneCount = parts.filter((part) => part.status === "done").length;
    return {
      stage: Math.min(doneCount + 1, parts.length),
      totalStages: parts.length,
      forecastLabel: quarterLabel ? `FORECAST ${quarterLabel}` : "FORECAST",
      estimatedMinutes: 4,
      title: doneCount === parts.length ? "Bạn đã hoàn thành buổi tập hôm nay" : "Bắt đầu buổi tập nói",
      description: "Ghi âm trực tiếp — AI chấm band ngay sau khi bạn nói xong.",
      parts,
    };
  }

  private buildTestScore(
    mockTests: Awaited<ReturnType<DashboardRepository["findLatestScoredMockTests"]>>,
    completed: number,
    timezone: string,
  ) {
    const [latest, previous] = mockTests;
    return {
      currentBand: latest?.bandOverall?.toNumber() ?? null,
      previousDelta: latest?.deltaPrev?.toNumber() ?? null,
      fullTestsCompleted: Math.min(completed, FULL_TESTS_REQUIRED),
      fullTestsRequired: FULL_TESTS_REQUIRED,
      fullTestDurationMinutes: latest?.durationMs ? Math.round(latest.durationMs / 60_000) : DEFAULT_FULL_TEST_MINUTES,
      lastAttemptDate: previous ? ddMm(previous.takenAt, timezone) : null,
      lastAttemptBand: previous?.bandOverall?.toNumber() ?? null,
    };
  }

  private heatmapStart(today: Date) {
    const mondayOffset = (today.getUTCDay() + 6) % 7;
    return addDays(today, -mondayOffset - (HEATMAP_WEEKS - 1) * 7);
  }

  /** Monday-first weeks ending with the current one; future days are omitted. */
  private buildHeatmap(
    practiceDays: Awaited<ReturnType<DashboardRepository["findPracticeDays"]>>,
    today: Date,
  ) {
    const byDay = new Map(practiceDays.map((row) => [row.day.getTime(), row]));
    const start = this.heatmapStart(today);
    const monthLabels: { weekIndex: number; label: string }[] = [];
    const weeks: { date: string; level: number; sessionCount: number }[][] = [];
    let lastMonth = -1;
    let totalDays = 0;
    let activeDays = 0;

    for (let week = 0; week < HEATMAP_WEEKS; week += 1) {
      const cells: (typeof weeks)[number] = [];
      for (let dow = 0; dow < 7; dow += 1) {
        const date = addDays(start, week * 7 + dow);
        if (date > today) continue;

        const month = date.getUTCMonth();
        if (month !== lastMonth) {
          monthLabels.push({ weekIndex: week, label: `Th${month + 1}` });
          lastMonth = month;
        }

        const row = byDay.get(date.getTime());
        const level = row?.intensity ?? 0;
        totalDays += 1;
        if (level > 0) activeDays += 1;
        cells.push({ date: date.toISOString().slice(0, 10), level, sessionCount: row?.attemptsCount ?? 0 });
      }
      weeks.push(cells);
    }

    return { monthLabels, weekdayLabels: ["T2", "", "T4", "", "T6", "", "CN"], weeks, totalDays, activeDays };
  }

  /** The hero pick is the word of the day; the remaining picks become its related words. */
  private buildVocabulary(picks: Awaited<ReturnType<VocabularyService["getDailyPicks"]>>) {
    const hero = picks.find((pick) => pick.isHero) ?? picks[0];
    if (!hero) return null;
    const { vocabItem } = hero;
    return {
      word: vocabItem.term,
      phonetic: vocabItem.ipa,
      meaning: vocabItem.meaningVi,
      exampleSentence: vocabItem.exampleEn,
      highlightWord: vocabItem.term,
      relatedWords: picks
        .filter((pick) => pick !== hero)
        .map((pick) => ({ word: pick.vocabItem.term, category: pick.vocabItem.vocabTopic?.nameEn ?? pick.vocabItem.kind })),
    };
  }
}
