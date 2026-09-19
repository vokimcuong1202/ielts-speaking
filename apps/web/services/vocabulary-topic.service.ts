import type { VocabularyTopicDetail } from "@/types/vocabulary";
import { ApiError, apiFetch } from "@/lib/api-client";

export const vocabularyTopicService = {
  async getTopicDetail(topicId: string): Promise<VocabularyTopicDetail | null> {
    try {
      return await apiFetch<VocabularyTopicDetail>(`/vocabulary/topics/${encodeURIComponent(topicId)}/detail`);
    } catch (error) {
      if (error instanceof ApiError && (error.status === 404 || error.status === 400)) return null;
      throw error;
    }
  },
};
