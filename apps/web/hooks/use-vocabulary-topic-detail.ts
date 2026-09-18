import { useQuery } from "@tanstack/react-query";
import { vocabularyTopicService } from "@/services/vocabulary-topic.service";

export function useVocabularyTopicDetail(topicId: string) {
  return useQuery({
    queryKey: ["vocabulary-topic-detail", topicId],
    queryFn: () => vocabularyTopicService.getTopicDetail(topicId),
  });
}
