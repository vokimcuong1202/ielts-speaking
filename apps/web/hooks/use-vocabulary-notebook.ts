import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth.store";
import { vocabularyService, type VocabularyNotebookParams } from "@/services/vocabulary.service";

export function useVocabularyNotebook(params: VocabularyNotebookParams) {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["vocabulary-notebook", params, accessToken],
    enabled: !!accessToken,
    retry: false,
    placeholderData: keepPreviousData,
    queryFn: () => vocabularyService.getNotebook(params),
  });
}
