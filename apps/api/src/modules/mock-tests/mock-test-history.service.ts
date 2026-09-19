import { Injectable, NotFoundException } from "@nestjs/common";
import { addDays, localDate, localDateString } from "../../common/utils/local-date";
import { MockTestsRepository } from "./mock-tests.repository";
import { MockTestHistoryQuery, MockTestType } from "./dto/mock-test-history.query";

type HistoryIndexRow = Awaited<ReturnType<MockTestsRepository["listHistoryIndex"]>>[number];
type HistoryDetail = Awaited<ReturnType<MockTestsRepository["findHistoryDetails"]>>[number];
type HistoryAttempt = HistoryDetail["attempts"][number];

const DEFAULT_LIMIT = 10;
const HEATMAP_WEEKS = 22;
const PENDING = ["recording", "uploaded", "grading"];

const INVALID_REASON_VI: Record<string, string> = {
  no_speech: "Không nghe thấy giọng nói trong bài thi",
  too_short: "Bài nói quá ngắn để chấm điểm",
  off_topic: "Bài nói lạc đề so với câu hỏi",
  mic_error: "Lỗi micro khi ghi âm",
  language_other: "Bài nói không phải tiếng Anh",
};

const round1 = (value: number) => Math.round(value * 10) / 10;

/** Web `TestType`: a full test, or the single part its session was created for. */
const testTypeOf = (row: HistoryIndexRow): MockTestType =>
  row.session?.mode === "mock_part" && row.session.part ? row.session.part : "full";

@Injectable()
export class MockTestHistoryService {
  constructor(private readonly mockTestsRepository: MockTestsRepository) {}

  /** Everything the "Thi thử" page renders, in the shape of web `TestHistoryData`. */
  async getHistory(userId: string, query: MockTestHistoryQuery) {
    const user = await this.mockTestsRepository.findUserTimezone(userId);
    if (!user) throw new NotFoundException("User not found");

    const index = await this.mockTestsRepository.listHistoryIndex(userId);
    const filtered = query.type ? index.filter((row) => testTypeOf(row) === query.type) : index;
    const offset = query.offset ?? 0;
    const page = filtered.slice(offset, offset + (query.limit ?? DEFAULT_LIMIT));

    const details = await this.mockTestsRepository.findHistoryDetails(userId, page.map((row) => row.id));
    const detailById = new Map(details.map((detail) => [detail.id, detail]));
    const chains = this.buildRetakeChains(index);
    const bandById = new Map(index.map((row) => [row.id, row.bandOverall?.toNumber() ?? null]));

    const attempts = page.flatMap((row) => {
      const detail = detailById.get(row.id);
      if (!detail) return [];
      const chain = chains.get(row.id);
      const firstBand = chain?.rootId ? (bandById.get(chain.rootId) ?? null) : null;
      return [this.buildAttempt(detail, row, user.timezone, chain?.depth ?? 0, firstBand)];
    });

    return {
      activity: this.buildActivity(index, user.timezone),
      counts: this.buildCounts(index),
      attempts,
      totalAttemptsOlder: Math.max(0, filtered.length - offset - page.length),
    };
  }

  /** depth = how many earlier tests this one retakes; rootId = the first test of the chain. */
  private buildRetakeChains(index: HistoryIndexRow[]) {
    const parentOf = new Map(index.map((row) => [row.id, row.retakeOfId]));
    const chains = new Map<bigint, { depth: number; rootId: bigint | null }>();
    for (const { id } of index) {
      let depth = 0;
      let cursor = parentOf.get(id) ?? null;
      let rootId: bigint | null = null;
      while (cursor !== null && depth <= index.length) {
        rootId = cursor;
        depth += 1;
        cursor = parentOf.get(cursor) ?? null;
      }
      chains.set(id, { depth, rootId });
    }
    return chains;
  }

  private buildCounts(index: HistoryIndexRow[]) {
    const counts: Record<"all" | MockTestType, number> = { all: index.length, part1: 0, part2: 0, part3: 0, full: 0 };
    for (const row of index) counts[testTypeOf(row)] += 1;
    return counts;
  }

  /** Monday-first weeks ending with the current one, one cell per day (level = tests taken that day, max 4). */
  private buildActivity(index: HistoryIndexRow[], timezone: string) {
    const perDay = new Map<string, number>();
    for (const row of index) {
      const key = localDateString(timezone, row.takenAt);
      perDay.set(key, (perDay.get(key) ?? 0) + 1);
    }

    const today = localDate(timezone);
    const mondayOffset = (today.getUTCDay() + 6) % 7;
    const start = addDays(today, -mondayOffset - (HEATMAP_WEEKS - 1) * 7);
    const monthLabels: { weekIndex: number; label: string }[] = [];
    const weeks: { date: string; level: number }[][] = [];
    let lastMonth = -1;

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
        const isoDate = date.toISOString().slice(0, 10);
        cells.push({ date: isoDate, level: Math.min(perDay.get(isoDate) ?? 0, 4) });
      }
      weeks.push(cells);
    }

    const bands = index.flatMap((row) => (row.status === "scored" && row.bandOverall ? [row.bandOverall.toNumber()] : []));
    return { monthLabels, weeks, totalAttempts: index.length, bestBand: bands.length ? Math.max(...bands) : 0 };
  }

  private buildAttempt(
    mock: HistoryDetail,
    row: HistoryIndexRow,
    timezone: string,
    retryCount: number,
    firstBand: number | null,
  ) {
    const testType = testTypeOf(row);
    const status = mock.status === "scored" ? "completed" : mock.status === "invalidated" ? "invalid" : "grading";
    const band = mock.bandOverall?.toNumber();
    const questions = this.buildQuestions(mock.attempts, status === "completed");
    const weakest = questions.find((question) => question.isWeakest);
    const settled = mock.attempts.filter((attempt) => !PENDING.includes(attempt.status)).length;

    const base = {
      id: String(mock.id),
      testType,
      title: testType === "full" ? "Full Test" : `Test Part ${testType.slice(-1)}`,
      status,
      timestamp: this.formatTimestamp(mock.takenAt, timezone),
      ...(retryCount > 0 && { retryCount }),
      summary: this.buildSummary(mock, status, weakest?.question),
      ...(status === "grading" && {
        gradingPercent: mock.attempts.length ? Math.round((settled / mock.attempts.length) * 100) : 0,
      }),
      ...(status === "completed" && band !== undefined && { band }),
      ...(status === "completed" && band !== undefined && firstBand !== null && retryCount > 0 && band > firstBand && {
        deltaFromFirstAttempt: round1(band - firstBand),
      }),
      ...(status === "completed" && { skills: this.buildSkills(mock.mockTestScores) }),
    };

    if (status === "grading" && questions.length === 0) {
      return {
        ...base,
        detail: { note: "Kết quả từng câu sẽ hiển thị ở đây ngay khi AI chấm xong — thường mất dưới 1 phút.", questions },
      };
    }
    if (questions.length === 0) return base;

    return {
      ...base,
      ...(status === "invalid" && {
        expandLabel: `Xem ${questions.length} câu đã ghi`,
        collapseLabel: `Ẩn ${questions.length} câu đã ghi`,
      }),
      detail: {
        ...(status === "completed" && { durationLabel: this.buildDurationLabel(mock, questions.length) }),
        ...(status === "invalid" && {
          note: `${questions.length} câu đã ghi âm trước khi bài thi bị huỷ. Vì phiên thi không hợp lệ nên các câu này không được chấm điểm.`,
        }),
        questions,
      },
    };
  }

  private buildSummary(mock: HistoryDetail, status: string, weakestQuestion?: string) {
    if (status === "invalid") return INVALID_REASON_VI[mock.invalidReason ?? ""] ?? "SpeakPrep không chấm lần này.";
    if (status === "grading") return `AI đang chấm ${mock.attempts.length} câu — thường mất dưới 1 phút, bạn có thể rời trang.`;
    if (mock.summaryVi) return mock.summaryVi;
    return weakestQuestion ? `Câu yếu nhất: "${weakestQuestion}"` : "";
  }

  private buildDurationLabel(mock: HistoryDetail, questionCount: number) {
    const parts = [`${questionCount} câu`];
    if (mock.durationMs) {
      const totalSeconds = Math.round(mock.durationMs / 1000);
      parts.push(`${Math.floor(totalSeconds / 60)} phút ${String(totalSeconds % 60).padStart(2, "0")} giây`);
    }
    if (mock.examinerVoice) parts.push(`giọng ${mock.examinerVoice.name}`);
    return parts.join(" · ");
  }

  private buildSkills(scores: HistoryDetail["mockTestScores"]) {
    const bandOf = (criterion: string) => scores.find((score) => score.criterion === criterion)?.band.toNumber() ?? 0;
    return {
      fluency: bandOf("fluency"),
      vocabulary: bandOf("lexical"),
      grammar: bandOf("grammar"),
      pronunciation: bandOf("pronunciation"),
    };
  }

  /** The weakest question is only flagged on scored tests with something to compare against. */
  private buildQuestions(attempts: HistoryAttempt[], flagWeakest: boolean) {
    const scoredBands = attempts.flatMap((attempt) => (attempt.bandOverall ? [attempt.bandOverall.toNumber()] : []));
    const lowest = scoredBands.length > 1 ? Math.min(...scoredBands) : null;
    let weakestAssigned = false;

    return attempts.map((attempt, position) => {
      const band = attempt.bandOverall?.toNumber();
      const isWeakest = flagWeakest && !weakestAssigned && lowest !== null && band === lowest;
      if (isWeakest) weakestAssigned = true;

      const bandOf = (criterion: string) => attempt.attemptScores.find((score) => score.criterion === criterion)?.band.toNumber();
      const weakestComment = [...attempt.attemptScores].sort((a, b) => a.band.toNumber() - b.band.toNumber())[0]?.commentVi;

      return {
        id: String(attempt.id),
        index: position + 1,
        question: attempt.question.textEn,
        ...(isWeakest && { isWeakest }),
        ...(band !== undefined && { band }),
        ...(band !== undefined && {
          skills: {
            fluency: bandOf("fluency") ?? band,
            vocabulary: bandOf("lexical") ?? band,
            grammar: bandOf("grammar") ?? band,
            pronunciation: bandOf("pronunciation") ?? band,
          },
        }),
        content: this.buildContent(attempt, weakestComment),
        ...(weakestComment && { feedback: weakestComment }),
      };
    });
  }

  private buildContent(attempt: HistoryAttempt, explanation?: string | null) {
    if (attempt.attemptTranscriptSpans.length > 0) {
      return { kind: "transcript" as const, segments: this.buildSegments(attempt.attemptTranscriptSpans) };
    }
    return {
      kind: "shortAnswer" as const,
      quote: attempt.transcript ?? "",
      explanation: attempt.status === "scored" ? (explanation ?? "") : "chưa được chấm điểm",
    };
  }

  /** keep -> text; delete/filler -> struck-through; insert -> added (merged into a preceding bare delete). */
  private buildSegments(spans: HistoryAttempt["attemptTranscriptSpans"]) {
    type Segment = { kind: "text"; content: string } | { kind: "diff"; remove?: string; add?: string };
    const segments: Segment[] = [];
    for (const span of spans) {
      const last = segments[segments.length - 1];
      if (span.kind === "keep") {
        segments.push({ kind: "text", content: span.text });
      } else if (span.kind === "insert") {
        if (last?.kind === "diff" && last.remove && !last.add) last.add = span.text;
        else segments.push({ kind: "diff", add: span.text });
      } else {
        segments.push({ kind: "diff", remove: span.text, ...(span.replacement && { add: span.replacement }) });
      }
    }
    return segments;
  }

  /** "15/09 · 16:38" in the user's timezone. */
  private formatTimestamp(date: Date, timezone: string) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date);
    const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
    return `${get("day")}/${get("month")} · ${get("hour")}:${get("minute")}`;
  }
}
