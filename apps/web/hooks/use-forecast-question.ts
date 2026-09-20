import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { forecastQuestionService } from "@/services/forecast-question.service";
import { savedVocabularyService } from "@/services/saved-vocabulary.service";
import type { AttemptReportReason, ForecastQuestionPractice } from "@/types/forecast-question";

const GRADING_POLL_MS = 2000;

const questionKey = (idOrSlug: string) => ["forecast-question", idOrSlug] as const;

/** Polls while an attempt is still being transcribed / scored, so the card fills in on its own. */
export function useForecastQuestion(idOrSlug: string) {
  return useQuery({
    queryKey: questionKey(idOrSlug),
    queryFn: () => forecastQuestionService.getPractice(idOrSlug),
    refetchInterval: (query) =>
      query.state.data?.attempts.some((attempt) => attempt.status === "grading") ? GRADING_POLL_MS : false,
  });
}

/** Save / bookmark / report mutations; each one refreshes the page data on success. */
export function useForecastQuestionActions(idOrSlug: string, questionId: string) {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: questionKey(idOrSlug) });

  const bookmark = useMutation({
    mutationFn: (isBookmarked: boolean) => forecastQuestionService.setBookmark(questionId, isBookmarked),
    // Flip the heart immediately; a failure is corrected by the refetch below.
    onMutate: (isBookmarked) => {
      queryClient.setQueryData<ForecastQuestionPractice>(questionKey(idOrSlug), (data) =>
        data ? { ...data, isBookmarked } : data
      );
    },
    onSettled: refresh,
  });

  const saveWord = useMutation({
    mutationFn: (vocabItemId: string) => savedVocabularyService.save(vocabItemId, questionId),
    onSuccess: refresh,
  });

  const saveWords = useMutation({
    mutationFn: (vocabItemIds: string[]) => savedVocabularyService.saveMany(vocabItemIds, questionId),
    onSuccess: refresh,
  });

  const removeWord = useMutation({
    mutationFn: (userVocabId: string) => savedVocabularyService.remove(userVocabId),
    onSuccess: refresh,
  });

  const reportAttempt = useMutation({
    mutationFn: (params: { attemptId: string; reason: AttemptReportReason }) =>
      forecastQuestionService.reportAttempt(params.attemptId, { reason: params.reason }),
  });

  return { bookmark, saveWord, saveWords, removeWord, reportAttempt, refresh };
}
