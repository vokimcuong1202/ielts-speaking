import { Injectable } from "@nestjs/common";
import { ForecastRepository } from "./forecast.repository";

type Row = Awaited<ReturnType<ForecastRepository["findPracticeQuestions"]>>[number];
type Progress = Awaited<ReturnType<ForecastRepository["findProgressFor"]>>[number];
type TopicGroup = { id: bigint; slug: string; nameEn: string; nameVi: string | null; sortOrder: number };

/** Anything shown as a practiceable question line: a forecast row's question or a follow-up. */
type Item = { questionId: bigint; title: string };

type Status = "new" | "unanswered" | "answered";
type Badge = { label: string; variant: "brand" | "warning" | "neutral" | "outline" };

const HIDE_ANSWERED_QUESTIONS = "Ẩn câu đã trả lời";
const PART3_TIP = "Part 3 chấm ý và lập luận — mỗi câu nên có 1 ví dụ cụ thể.";

const NEW_BADGE = (count: number): Badge => ({ label: `${count} MỚI`, variant: "brand" });
const HOT_BADGE: Badge = { label: "HAY RA", variant: "warning" };

/** dd/MM, the format every date label on the page uses. */
const dayMonth = (date: Date, timeZone = "UTC") =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", timeZone }).format(date);

const toBand = (value: { toNumber(): number } | null | undefined) => value?.toNumber() ?? null;
const toItem = (row: Row): Item => ({ questionId: row.questionId, title: row.question.textEn });
const groupLabel = (group: TopicGroup) => group.nameVi ?? group.nameEn;

@Injectable()
export class ForecastPracticeService {
  constructor(private readonly forecastRepository: ForecastRepository) {}

  /** Everything the "Luyện forecast" page renders, in the shape of web `ForecastPracticeData`. */
  async getPractice(userId: string, set: { id: bigint; quarterLabel: string }) {
    const rows = await this.forecastRepository.findPracticeQuestions(set.id);
    const progress = await this.forecastRepository.findProgressFor(
      userId,
      rows.flatMap((row) => [row.questionId, ...row.question.followUps.map((followUp) => followUp.id)]),
    );
    const progressById = new Map(progress.map((item) => [item.questionId, item]));

    const byPart = (part: string) => rows.filter((row) => row.question.part === part);
    const part1 = this.buildPart1(byPart("part1"), progressById);
    const part2 = this.buildPart2(byPart("part2"), progressById, set.quarterLabel);
    const part3 = this.buildPart3(byPart("part2"), progressById);

    return {
      quarterLabel: `Luyện Forecast · ${set.quarterLabel}`,
      parts: [
        { id: "part1", label: "Part 1", count: part1.topics.length },
        { id: "part2", label: "Part 2", count: part2.groups.reduce((sum, group) => sum + group.unitCount, 0) },
        { id: "part3", label: "Part 3", count: part3.groups.reduce((sum, group) => sum + group.unitCount, 0) },
        { id: "custom", label: "Câu bạn thêm", count: 0 },
      ],
      part1,
      part2,
      part3,
      // Questions are global (no owner column), so users cannot add their own yet.
      custom: {
        pageTitle: "Câu bạn thêm",
        hideAnsweredLabel: HIDE_ANSWERED_QUESTIONS,
        sortOptions: [
          { id: "newestTopic", label: "Mới thêm nhất" },
          { id: "unpracticed", label: "Chưa luyện trước" },
        ],
        topics: [],
      },
    };
  }

  private statusOf(row: Row, progress: Progress | undefined): Status {
    if (progress && progress.attemptsCount > 0) return "answered";
    return row.flag === "new" ? "new" : "unanswered";
  }

  /** Answered / total / latest band / weakest question for a set of rows, or undefined if none answered. */
  private summarize(items: Item[], progressById: Map<bigint, Progress>) {
    const answered = items.flatMap((item) => {
      const mine = progressById.get(item.questionId);
      return mine && mine.attemptsCount > 0 ? [{ item, mine }] : [];
    });
    if (answered.length === 0) return undefined;

    const dated = answered.filter(({ mine }) => mine.lastPracticedAt);
    const latest = dated.sort((a, b) => b.mine.lastPracticedAt!.getTime() - a.mine.lastPracticedAt!.getTime())[0];
    const scored = answered.filter(({ mine }) => mine.lastBand !== null);
    const lowest = scored.sort((a, b) => a.mine.lastBand!.toNumber() - b.mine.lastBand!.toNumber())[0];

    return {
      answeredCount: answered.length,
      totalCount: items.length,
      lastPracticedLabel: latest?.mine.lastPracticedAt ? dayMonth(latest.mine.lastPracticedAt) : "",
      lowestScoreQuestionTitle: (lowest ?? answered[0]).item.title,
      latestBand: toBand(latest?.mine.lastBand) ?? 0,
    };
  }

  private vocabularyOf(rows: Row[]) {
    const terms = rows.flatMap((row) => row.question.questionVocab.map((item) => item.vocabItem.term));
    return [...new Set(terms)].slice(0, 3);
  }

  private buildPart1(rows: Row[], progressById: Map<bigint, Progress>) {
    const topics = new Map<bigint, { group: TopicGroup; rows: Row[] }>();
    for (const row of rows) {
      const group = row.question.topicGroup;
      if (!group) continue;
      const entry = topics.get(group.id) ?? { group, rows: [] };
      entry.rows.push(row);
      topics.set(group.id, entry);
    }

    const ordered = [...topics.values()].sort((a, b) => a.group.sortOrder - b.group.sortOrder || Number(a.group.id - b.group.id));
    return {
      pageTitle: `Part 1 — ${ordered.length} topic đời thường`,
      hideAnsweredLabel: HIDE_ANSWERED_QUESTIONS,
      sortOptions: [
        { id: "newestTopic", label: "Topic mới nhất" },
        { id: "probability", label: "Xác suất ra đề" },
        { id: "unpracticed", label: "Chưa luyện trước" },
      ],
      topics: ordered.map(({ group, rows: topicRows }) => {
        const isNewTopic = topicRows.every((row) => row.flag === "new");
        const entered = topicRows.flatMap((row) => (row.enteredSetOn ? [row.enteredSetOn] : []));
        const added = entered.sort((a, b) => a.getTime() - b.getTime())[0];
        return {
          id: group.id.toString(),
          name: group.nameEn,
          isNewTopic,
          hasNewQuestions: topicRows.some((row) => this.statusOf(row, progressById.get(row.questionId)) === "new"),
          ...(isNewTopic && added ? { addedDateLabel: dayMonth(added) } : {}),
          questions: topicRows.map((row) => ({
            id: row.questionId.toString(),
            title: row.question.textEn,
            status: this.statusOf(row, progressById.get(row.questionId)),
          })),
          vocabulary: this.vocabularyOf(topicRows),
          practiceSummary: this.summarize(topicRows.map(toItem), progressById),
        };
      }),
    };
  }

  private buildPart2(rows: Row[], progressById: Map<bigint, Progress>, quarterLabel: string) {
    const groups = new Map<bigint, { group: TopicGroup; cards: ReturnType<ForecastPracticeService["cueCard"]>[]; rows: Row[] }>();
    for (const row of rows) {
      const group = row.question.topicGroup;
      if (!group) continue;
      const entry = groups.get(group.id) ?? { group, cards: [], rows: [] };
      entry.cards.push(this.cueCard(row, group, progressById.get(row.questionId)));
      entry.rows.push(row);
      groups.set(group.id, entry);
    }

    const ordered = [...groups.values()].sort((a, b) => a.group.sortOrder - b.group.sortOrder || Number(a.group.id - b.group.id));
    return {
      pageTitle: `Bộ đề dự đoán ${quarterLabel}`,
      hideAnsweredLabel: "Ẩn đề đã luyện",
      groups: ordered.map(({ group, rows: groupRows }) => {
        const practiced = groupRows.filter((row) => (progressById.get(row.questionId)?.attemptsCount ?? 0) > 0).length;
        return {
          id: group.slug,
          label: groupLabel(group),
          ...this.groupBadge(groupRows),
          unitCount: groupRows.length,
          unitLabel: "đề",
          practicedCount: practiced,
          progressLabel: practiced > 0 ? `${practiced}/${groupRows.length} đã luyện` : "chưa luyện đề nào",
        };
      }),
      cueCardsByGroup: Object.fromEntries(ordered.map(({ group, cards }) => [group.slug, cards])),
    };
  }

  private cueCard(row: Row, group: TopicGroup, progress: Progress | undefined) {
    const { question } = row;
    const attempts = progress?.attemptsCount ?? 0;
    const practicedOn = progress?.lastPracticedAt ? dayMonth(progress.lastPracticedAt) : undefined;
    const appearances = `${row.appearances30d} lần/30 ngày`;
    const enteredOn = row.flag === "new" && row.enteredSetOn ? `vào bộ ${dayMonth(row.enteredSetOn)} · ` : "";
    const sidebarMetaLabel = attempts > 0 ? `đã luyện ${attempts} lần` : `${enteredOn}${appearances}`;
    const tag = row.flag === "hot" ? HOT_BADGE : row.flag === "new" ? ({ label: "ĐỀ MỚI", variant: "brand" } as Badge) : undefined;

    return {
      id: question.id.toString(),
      groupId: group.slug,
      ...(tag ? { tag } : {}),
      title: question.textEn,
      prompts: question.cueCardBullets,
      prepMinutes: Math.max(1, Math.ceil((question.prepSeconds ?? 60) / 60)),
      speakMinutes: Math.max(1, Math.ceil((question.speakSeconds ?? 120) / 60)),
      vocabulary: this.vocabularyOf([row]),
      followUpCount: question._count.followUps,
      sidebarMetaLabel,
      rowMetaLabel: attempts > 0 && practicedOn ? `${sidebarMetaLabel} · ${practicedOn}` : sidebarMetaLabel,
      statusLabel: attempts > 0 ? `đã luyện ${attempts} lần` : "chưa luyện",
      practiceSummary: attempts > 0 ? { practicedCount: attempts, latestBand: toBand(progress?.lastBand) ?? 0 } : undefined,
    };
  }

  /** "N MỚI" when the group has new rows, else "HAY RA" when it has hot ones. */
  private groupBadge(rows: Row[]): { badge?: Badge } {
    const fresh = rows.filter((row) => row.flag === "new").length;
    if (fresh > 0) return { badge: NEW_BADGE(fresh) };
    if (rows.some((row) => row.flag === "hot")) return { badge: HOT_BADGE };
    return {};
  }

  /** Part 3 is the follow-up questions of each Part 2 cue card in the set, one cluster per cue card. */
  private buildPart3(cueCards: Row[], progressById: Map<bigint, Progress>) {
    type Cluster = { row: Row; items: Item[]; answered: number };
    const groups = new Map<bigint, { group: TopicGroup; clusters: Cluster[] }>();
    for (const row of cueCards) {
      const group = row.question.topicGroup;
      if (!group || row.question.followUps.length === 0) continue;
      const items = row.question.followUps.map((followUp) => ({ questionId: followUp.id, title: followUp.textEn }));
      const answered = items.filter((item) => (progressById.get(item.questionId)?.attemptsCount ?? 0) > 0).length;
      const entry = groups.get(group.id) ?? { group, clusters: [] };
      entry.clusters.push({ row, items, answered });
      groups.set(group.id, entry);
    }
    const ordered = [...groups.values()].sort((a, b) => a.group.sortOrder - b.group.sortOrder || Number(a.group.id - b.group.id));

    return {
      pageTitle: "Part 3 nối tiếp theo nhóm chủ đề",
      hideAnsweredLabel: HIDE_ANSWERED_QUESTIONS,
      groups: ordered.map(({ group, clusters }) => {
        const practiced = clusters.filter((cluster) => cluster.answered > 0).length;
        return {
          id: group.slug,
          label: groupLabel(group),
          ...this.groupBadge(clusters.map((cluster) => cluster.row)),
          unitCount: clusters.length,
          unitLabel: "chùm",
          practicedCount: practiced,
          progressLabel: practiced > 0 ? `${practiced}/${clusters.length} đã trả lời` : "chưa trả lời",
        };
      }),
      clustersByGroup: Object.fromEntries(
        ordered.map(({ group, clusters }) => [
          group.slug,
          clusters.map((cluster) => this.followUpCluster(cluster, group, progressById)),
        ]),
      ),
    };
  }

  private followUpCluster(
    { row, items, answered }: { row: Row; items: Item[]; answered: number },
    group: TopicGroup,
    progressById: Map<bigint, Progress>,
  ) {
    const practiceSummary = this.summarize(items, progressById);
    const weak = practiceSummary && practiceSummary.latestBand < 6;

    return {
      id: `cluster-${row.questionId}`,
      groupId: group.slug,
      sourceTitle: row.question.textEn,
      questions: items.map((item) => ({
        id: item.questionId.toString(),
        title: item.title,
        status: progressById.get(item.questionId)?.attemptsCount ? "answered" : row.flag === "new" ? "new" : "unanswered",
      })),
      ...(weak ? { sidebarBadge: { label: `band ${practiceSummary.latestBand.toFixed(1)}`, variant: "warning" } satisfies Badge } : {}),
      sidebarMetaLabel: answered > 0 ? `${answered}/${items.length} câu` : `${items.length} câu · chưa trả lời`,
      ...(answered === 0 ? { tipText: PART3_TIP } : {}),
      practiceSummary,
    };
  }
}
