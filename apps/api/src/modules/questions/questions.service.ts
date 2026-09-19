import { Injectable, NotFoundException } from "@nestjs/common";
import { IeltsPart } from "../../../../../database/generated/client";
import { QuestionsRepository } from "./questions.repository";

@Injectable()
export class QuestionsService {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  list(filter: { part?: IeltsPart; topicGroupId?: bigint; parentQuestionId?: bigint; search?: string; limit?: number }) {
    return this.questionsRepository.findMany({ ...filter, limit: Math.min(filter.limit ?? 50, 100) });
  }

  async getDetail(userId: string, id: bigint) {
    const question = await this.questionsRepository.findById(id);
    if (!question) throw new NotFoundException("Question not found");
    const progress = await this.questionsRepository.findProgress(userId, id);
    return { ...question, progress };
  }

  async getVocab(id: bigint, bandTier?: number) {
    await this.assertExists(id);
    return this.questionsRepository.findVocab(id, bandTier);
  }

  async getMyAttempts(userId: string, id: bigint) {
    await this.assertExists(id);
    return this.questionsRepository.findAttemptHistory(userId, id);
  }

  async setBookmark(userId: string, id: bigint, isBookmarked: boolean) {
    await this.assertExists(id);
    return this.questionsRepository.setBookmark(userId, id, isBookmarked);
  }

  private async assertExists(id: bigint) {
    if (!(await this.questionsRepository.exists(id))) throw new NotFoundException("Question not found");
  }
}
