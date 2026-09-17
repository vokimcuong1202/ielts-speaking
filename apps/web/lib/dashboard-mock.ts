import type {
  DashboardHomeData,
  HeatmapData,
  HeatmapDay,
  HeatmapMonthLabel,
} from "@/types/dashboard";

// Deterministic PRNG so server- and client-rendered markup match (Math.random would not).
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildHeatmap(): HeatmapData {
  const random = mulberry32(42);
  const weekCount = 22;
  const weeks: HeatmapDay[][] = [];
  const monthLabels: HeatmapMonthLabel[] = [];
  let activeDays = 0;
  let totalDays = 0;
  let lastMonth = -1;

  const start = new Date();
  start.setDate(start.getDate() - weekCount * 7);

  for (let week = 0; week < weekCount; week += 1) {
    const days: HeatmapDay[] = [];
    for (let day = 0; day < 7; day += 1) {
      const date = new Date(start);
      date.setDate(date.getDate() + week * 7 + day);
      if (date > new Date()) continue;

      const month = date.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ weekIndex: week, label: `Th${month + 1}` });
        lastMonth = month;
      }

      const roll = random();
      const level = roll < 0.32 ? 0 : roll < 0.55 ? 1 : roll < 0.74 ? 2 : roll < 0.9 ? 3 : 4;

      totalDays += 1;
      if (level > 0) activeDays += 1;

      days.push({ date: date.toISOString().slice(0, 10), level: level as HeatmapDay["level"] });
    }
    weeks.push(days);
  }

  return {
    monthLabels,
    weekdayLabels: ["T2", "", "T4", "", "T6", "", "CN"],
    weeks,
    totalDays,
    activeDays,
  };
}

export function getDashboardMockData(): DashboardHomeData {
  return {
    user: {
      name: "Minh Anh",
      goalBand: 7,
      examDateLabel: "12/12",
      daysUntilExam: 89,
      todayLabel: "Thứ hai, 14/09 · 07:12",
    },
    todaySession: {
      stage: 2,
      totalStages: 3,
      forecastLabel: "FORECAST Q4",
      estimatedMinutes: 4,
      title: "Bắt đầu buổi tập nói",
      description: "Ghi âm trực tiếp — AI chấm band ngay sau khi bạn nói xong.",
      tip: "Part 2: 1 phút chuẩn bị, 2 phút nói — đúng nhịp phòng thi.",
      parts: [
        { id: "part1", label: "Part 1", status: "done", band: 6.5 },
        { id: "part2", label: "Part 2", status: "active", helperText: "đang chờ bạn" },
        { id: "part3", label: "Part 3", status: "locked", helperText: "chưa mở" },
      ],
    },
    testScore: {
      currentBand: 6.5,
      previousDelta: 0.5,
      fullTestsCompleted: 1,
      fullTestsRequired: 3,
      fullTestDurationMinutes: 14,
      lastAttemptDate: "07/09",
      lastAttemptBand: 6.0,
    },
    heatmap: buildHeatmap(),
    weekStreak: {
      currentStreak: 12,
      recordStreak: 31,
    },
    forecastQuestions: [
      {
        id: "q1",
        tagLabel: "HOT",
        tagVariant: "hot",
        part: "Part 2",
        title: "Describe a public place you often visit",
      },
      {
        id: "q2",
        tagLabel: "Technology",
        tagVariant: "neutral",
        part: "Part 3",
        title: "Should schools teach students how to use AI tools?",
      },
      {
        id: "q3",
        tagLabel: "Hometown",
        tagVariant: "neutral",
        part: "Part 1",
        title: "What do you like most about where you live?",
      },
      {
        id: "q4",
        tagLabel: "đã làm · 6.0",
        tagVariant: "warning",
        part: "Part 3",
        title: "Do governments fund practical skills enough?",
      },
    ],
    vocabulary: {
      word: "bustling",
      phonetic: "/ˈbʌs.lɪŋ/",
      meaning: "nhộn nhịp",
      exampleSentence: "a bustling night market near my house",
      highlightWord: "bustling",
      relatedWords: [
        { word: "vocational training", category: "Education" },
        { word: "employability", category: "Work" },
        { word: "a stone's throw away", category: "Places" },
      ],
    },
    sidebarProgress: {
      completed: 15,
      total: 25,
    },
  };
}
