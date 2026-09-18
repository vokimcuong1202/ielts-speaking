import type { VocabularyTopicDetail } from "@/types/vocabulary";
import { getVocabularyTopicDetailMockData } from "@/lib/vocabulary-topic-detail-mock";

export const vocabularyTopicService = {
  async getTopicDetail(topicId: string): Promise<VocabularyTopicDetail | null> {
    return getVocabularyTopicDetailMockData(topicId) ?? null;
  },
};
