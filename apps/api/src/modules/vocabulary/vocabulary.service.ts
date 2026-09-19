import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SrsState, VocabKind } from "../../../../../database/generated/client";
import { addDays, localDate } from "../../common/utils/local-date";
import { VocabularyRepository } from "./vocabulary.repository";
import { SaveVocabDto, SubmitReviewDto } from "./dto/vocabulary.dto";
import { isKnown, schedule } from "./srs";

const DAILY_PICK_COUNT = 5;

@Injectable()
export class VocabularyService {
  constructor(private readonly vocabularyRepository: VocabularyRepository) {}

  private async today(userId: string) {
    return localDate(await this.vocabularyRepository.findTimezone(userId));
  }

  listTopics() {
    return this.vocabularyRepository.findTopics();
  }

  /** Topic page: items plus a `saved` marker per item for the caller. */
  async getTopic(userId: string, id: bigint, filter: { bandTier?: number; kind?: VocabKind }) {
    const topic = await this.vocabularyRepository.findTopicWithItems(id, filter);
    if (!topic) throw new NotFoundException("Vocabulary topic not found");

    const saved = await this.vocabularyRepository.findSavedItemIds(
      userId,
      topic.vocabItems.map((item) => item.id),
    );
    const savedByItem = new Map(saved.map((row) => [row.vocabItemId, row]));

    return {
      ...topic,
      vocabItems: topic.vocabItems.map((item) => ({
        ...item,
        saved: savedByItem.has(item.id),
        userVocabId: savedByItem.get(item.id)?.id ?? null,
      })),
    };
  }

  /** "Từ vựng hôm nay": today's persisted picks, generated on first request of the day. */
  async getDailyPicks(userId: string) {
    const today = await this.today(userId);
    let picks = await this.vocabularyRepository.findDailyPicks(userId, today);
    if (picks.length === 0) {
      const items = await this.vocabularyRepository.findUnsavedItems(userId, DAILY_PICK_COUNT);
      if (items.length === 0) return [];
      await this.vocabularyRepository.createDailyPicks(userId, today, items.map((item) => item.id));
      picks = await this.vocabularyRepository.findDailyPicks(userId, today);
    }
    return picks;
  }

  async getNotebook(userId: string, filter: { state?: SrsState; sourceQuestionId?: bigint }) {
    const today = await this.today(userId);
    const [items, dueCount] = await Promise.all([
      this.vocabularyRepository.findNotebook(userId, filter),
      this.vocabularyRepository.countDue(userId, today),
    ]);
    return { dueCount, items };
  }

  async saveItem(userId: string, dto: SaveVocabDto) {
    if (!(await this.vocabularyRepository.itemExists(dto.vocabItemId))) {
      throw new NotFoundException("Vocabulary item not found");
    }
    return this.vocabularyRepository.save(userId, {
      vocabItemId: dto.vocabItemId,
      source: dto.source ?? "question_panel",
      sourceQuestionId: dto.sourceQuestionId,
      sourceAttemptId: dto.sourceAttemptId,
    });
  }

  async removeItem(userId: string, id: bigint) {
    const { count } = await this.vocabularyRepository.remove(id, userId);
    if (count === 0) throw new NotFoundException("Notebook entry not found");
  }

  // -------------------------------------------------------------------- review

  async startReview(userId: string, limit: number) {
    const today = await this.today(userId);
    const queue = await this.vocabularyRepository.findDueQueue(userId, today, limit);
    const session = await this.vocabularyRepository.createReviewSession(userId, queue.length);
    return { session, queue };
  }

  async submitReview(userId: string, sessionId: bigint, dto: SubmitReviewDto) {
    const [session, card] = await Promise.all([
      this.vocabularyRepository.findReviewSession(sessionId, userId),
      this.vocabularyRepository.findUserVocab(dto.userVocabId, userId),
    ]);
    if (!session) throw new NotFoundException("Review session not found");
    if (session.finishedAt) throw new BadRequestException("Review session is already finished");
    if (!card) throw new NotFoundException("Notebook entry not found");

    const next = schedule(
      { ease: card.ease.toNumber(), intervalDays: card.intervalDays, reps: card.reps, lapses: card.lapses },
      dto.rating,
    );
    const today = await this.today(userId);

    const { card: updated } = await this.vocabularyRepository.applyReview({
      sessionId,
      userVocabId: card.id,
      rating: dto.rating,
      known: isKnown(dto.rating),
      revealedMs: dto.revealedMs,
      intervalBefore: card.intervalDays,
      next,
      dueOn: addDays(today, next.intervalDays),
    });
    return updated;
  }

  async finishReview(userId: string, sessionId: bigint) {
    const session = await this.vocabularyRepository.findReviewSession(sessionId, userId);
    if (!session) throw new NotFoundException("Review session not found");
    if (session.finishedAt) return session;
    return this.vocabularyRepository.finishReviewSession(sessionId, userId);
  }
}
