import { useQuery } from "@tanstack/react-query";
import { vocabularyService } from "@/services/vocabulary.service";

export function useVocabularyNotebook() {
  return useQuery({
    queryKey: ["vocabulary-notebook"],
    queryFn: vocabularyService.getNotebook,
  });
}
