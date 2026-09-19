import { Injectable, NotFoundException } from "@nestjs/common";
import { addDays, localDate } from "../../common/utils/local-date";
import { ProgressRepository } from "./progress.repository";

@Injectable()
export class ProgressService {
  constructor(private readonly progressRepository: ProgressRepository) {}

  recordScoredAttempt(attemptId: bigint) {
    return this.progressRepository.applyScoredAttempt(attemptId);
  }

  /** Home page payload (5a): streak, week strip, goal, due vocab, next actions, latest mock. */
  async getDashboard(userId: string) {
    const today = localDate(await this.progressRepository.findTimezone(userId));

    const [goal, streak, stats, week, vocabDueCount, recommendations, latestMockTest, topErrors] = await Promise.all([
      this.progressRepository.findGoal(userId),
      this.progressRepository.findStreak(userId),
      this.progressRepository.findStats(userId),
      this.progressRepository.findPracticeDays(userId, addDays(today, -6), today),
      this.progressRepository.countDueVocab(userId, today),
      this.progressRepository.findRecommendations(userId, 3),
      this.progressRepository.findLatestMockTest(userId),
      this.progressRepository.findTopErrors(userId, 3),
    ]);

    return { goal, streak, stats, week, vocabDueCount, recommendations, latestMockTest, topErrors };
  }

  async getHeatmap(userId: string, days: number) {
    const today = localDate(await this.progressRepository.findTimezone(userId));
    return this.progressRepository.findPracticeDays(userId, addDays(today, -(days - 1)), today);
  }

  getBandHistory(userId: string) {
    return this.progressRepository.findBandHistory(userId);
  }

  getTopErrors(userId: string, limit: number) {
    return this.progressRepository.findTopErrors(userId, limit);
  }

  async dismissRecommendation(userId: string, id: bigint) {
    const { count } = await this.progressRepository.dismissRecommendation(id, userId);
    if (count === 0) throw new NotFoundException("Recommendation not found");
  }
}
