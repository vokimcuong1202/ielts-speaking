import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { answerSupportService } from "@/services/answer-support.service";
import { savedVocabularyService } from "@/services/saved-vocabulary.service";

const supportKey = (idOrSlug: string) => ["answer-support", idOrSlug] as const;

export function useAnswerSupport(idOrSlug: string, questionId: string) {
  const queryClient = useQueryClient();
  const support = useQuery({ queryKey: supportKey(idOrSlug), queryFn: () => answerSupportService.getSupport(idOrSlug) });

  // Saved state also shows in the "Từ vựng hay" tab, so refresh both.
  const refreshVocab = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: supportKey(idOrSlug) }),
      queryClient.invalidateQueries({ queryKey: ["forecast-question", idOrSlug] }),
    ]);

  const savePhrase = useMutation({ mutationFn: (vocabItemId: string) => savedVocabularyService.save(vocabItemId, questionId), onSuccess: refreshVocab });
  const savePhrases = useMutation({ mutationFn: (ids: string[]) => savedVocabularyService.saveMany(ids, questionId), onSuccess: refreshVocab });
  const removePhrase = useMutation({ mutationFn: (userVocabId: string) => savedVocabularyService.remove(userVocabId), onSuccess: refreshVocab });

  const saveNote = useMutation({
    mutationFn: (body: string) => answerSupportService.saveNote(idOrSlug, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: supportKey(idOrSlug) }),
  });
  const deleteNote = useMutation({
    mutationFn: () => answerSupportService.deleteNote(idOrSlug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: supportKey(idOrSlug) }),
  });

  return { support, savePhrase, savePhrases, removePhrase, saveNote, deleteNote };
}
