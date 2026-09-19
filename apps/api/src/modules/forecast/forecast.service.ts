import { Injectable, NotFoundException } from "@nestjs/common";
import { ForecastFlag, IeltsPart } from "../../../../../database/generated/client";
import { ForecastRepository, ForecastSort } from "./forecast.repository";

@Injectable()
export class ForecastService {
  constructor(private readonly forecastRepository: ForecastRepository) {}

  async getCurrentSet() {
    const set = await this.forecastRepository.findCurrentSet();
    if (!set) throw new NotFoundException("No forecast set is currently published");
    return set;
  }

  /** "current" resolves to the set flagged is_current. */
  async resolveSetId(idOrCurrent: bigint | "current") {
    if (idOrCurrent === "current") return (await this.getCurrentSet()).id;
    const set = await this.forecastRepository.findSet(idOrCurrent);
    if (!set) throw new NotFoundException("Forecast set not found");
    return set.id;
  }

  /** Forecast list rows merged with the caller's own progress (the old v_forecast_board view). */
  async listQuestions(
    userId: string,
    setId: bigint,
    filter: { part?: IeltsPart; topicGroupId?: bigint; flag?: ForecastFlag; sort?: ForecastSort; limit?: number },
  ) {
    const rows = await this.forecastRepository.findQuestions(setId, {
      ...filter,
      sort: filter.sort ?? "probability",
      limit: Math.min(filter.limit ?? 100, 200),
    });
    const progress = await this.forecastRepository.findProgressFor(
      userId,
      rows.map((row) => row.questionId),
    );
    const progressByQuestion = new Map(progress.map((item) => [item.questionId, item]));

    return rows.map(({ question, ...row }) => {
      const mine = progressByQuestion.get(question.id);
      const { _count, ...questionFields } = question;
      return {
        ...row,
        question: questionFields,
        followupsCount: _count.followUps,
        progress: mine && {
          attemptsCount: mine.attemptsCount,
          lastBand: mine.lastBand,
          bestBand: mine.bestBand,
          lastPracticedAt: mine.lastPracticedAt,
          isBookmarked: mine.isBookmarked,
        },
      };
    });
  }

  /** Topic cards for the forecast page: totals from the set, answered/avg from user_topic_progress. */
  async listTopics(userId: string, setId: bigint, part?: IeltsPart) {
    const [rows, progress] = await Promise.all([
      this.forecastRepository.findSetQuestionTopics(setId, part),
      this.forecastRepository.findTopicProgress(userId, setId),
    ]);
    const progressByTopic = new Map(progress.map((item) => [item.topicGroupId, item]));

    const topics = new Map<bigint, { topicGroup: NonNullable<(typeof rows)[number]["question"]["topicGroup"]>; total: number; hot: number }>();
    for (const { flag, question } of rows) {
      if (question.topicGroupId === null || !question.topicGroup) continue;
      const entry = topics.get(question.topicGroupId) ?? { topicGroup: question.topicGroup, total: 0, hot: 0 };
      entry.total += 1;
      if (flag === "hot") entry.hot += 1;
      topics.set(question.topicGroupId, entry);
    }

    return [...topics.values()]
      .sort((a, b) => a.topicGroup.sortOrder - b.topicGroup.sortOrder)
      .map(({ topicGroup, total, hot }) => {
        const mine = progressByTopic.get(topicGroup.id);
        return {
          topicGroup,
          questionsTotal: total,
          hotCount: hot,
          questionsAnswered: mine?.questionsAnswered ?? 0,
          avgBand: mine?.avgBand ?? null,
          hasNewQuestion: mine?.hasNewQuestion ?? false,
          lastPracticedAt: mine?.lastPracticedAt ?? null,
        };
      });
  }
}
