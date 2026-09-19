import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { vocabularyTopicService } from "@/services/vocabulary-topic.service";

export function useVocabularyTopicDetail(topicId: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["vocabulary-topic-detail", topicId, accessToken],
    enabled: !!accessToken,
    retry: false,
    queryFn: () => vocabularyTopicService.getTopicDetail(topicId),
  });
}
