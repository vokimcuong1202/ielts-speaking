"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingIndicator } from "@/components/layout/loading-screen";
import { Collapsible } from "@/components/ui/collapsible";
import { cn } from "@/lib/cn";
import { EmptyState } from "@/components/ui/empty-state";
import { QuestionHeader } from "@/components/forecast-question/question-header";
import { PracticeHistory } from "@/components/forecast-question/practice-history";
import { AttemptList } from "@/components/forecast-question/attempt-list";
import { RecordPrompt } from "@/components/forecast-question/record-prompt";
import { PracticeDock } from "@/components/forecast-question/practice-dock";
import { VocabularyPanel } from "@/components/forecast-question/vocabulary-panel";
import {
  useForecastQuestion,
  useForecastQuestionActions,
} from "@/hooks/use-forecast-question";
import { useRecordAttempt } from "@/hooks/use-record-attempt";
import { useAuthStore } from "@/stores/auth.store";
import type { ForecastQuestionPractice } from "@/types/forecast-question";

function ForecastQuestionContent({
  slug,
  partId,
  data,
}: {
  slug: string;
  partId: string;
  data: ForecastQuestionPractice;
}) {
  // Opened from a mock test ("Cải thiện câu này"): practise just this question, no walking through the list.
  const hideNavigation = useSearchParams().get("from") === "thi-thu";
  const { bookmark, saveWord, saveWords, removeWord, reportAttempt, refresh } =
    useForecastQuestionActions(slug, data.id);
  const record = useRecordAttempt({
    questionId: data.id,
    part: data.partId,
    onSubmitted: refresh,
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  // Recording takes over the area, so the prompt (and its animation) always shows while the mic is busy.
  const showList = isHistoryOpen && record.state === "idle";

  return (
    <div className="min-h-dvh bg-page xl:grid xl:h-dvh xl:grid-cols-[minmax(0,1fr)_420px] xl:overflow-hidden">
      <section className="flex min-w-0 flex-col xl:h-dvh">
        <div className="shrink-0 px-4 py-4 sm:px-6">
          <QuestionHeader
            partLabel={data.partLabel}
            title={data.title}
            isBookmarked={data.isBookmarked}
            onToggleBookmark={() => bookmark.mutate(!data.isBookmarked)}
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-4 pb-4 sm:px-6 xl:overflow-y-auto">
          <Collapsible isOpen={!showList} className={cn(!showList && "flex-1")}>
            <div className="flex h-full flex-col gap-4">
              <PracticeHistory
                attempts={data.attempts}
                onOpen={() => setIsHistoryOpen(true)}
              />
              <RecordPrompt
                state={record.state}
                elapsedSeconds={record.elapsedSeconds}
              />
            </div>
          </Collapsible>
          <Collapsible isOpen={showList}>
            <AttemptList
              attempts={data.attempts}
              onReport={(attemptId, reason) =>
                reportAttempt.mutateAsync({ attemptId, reason })
              }
              onClose={() => setIsHistoryOpen(false)}
            />
          </Collapsible>
        </div>

        <PracticeDock
          partId={partId}
          position={data.position}
          total={data.total}
          topicLabel={data.topicLabel}
          remainingToday={data.quota.remainingToday}
          ideaSteps={data.ideaSteps}
          sampleAnswers={data.sampleAnswers}
          record={{
            state: record.state,
            elapsedSeconds: record.elapsedSeconds,
            error: record.error,
            onToggle: record.toggle,
          }}
          hideNavigation={hideNavigation}
          previous={data.previous}
          next={data.next}
        />
      </section>

      <VocabularyPanel
        questionSlug={slug}
        questionId={data.id}
        vocabularyByBand={data.vocabularyByBand}
        onSave={(vocabItemId) => saveWord.mutateAsync(vocabItemId)}
        onRemove={(userVocabId) => removeWord.mutateAsync(userVocabId)}
        onSaveMany={(vocabItemIds) => saveWords.mutateAsync(vocabItemIds)}
      />
    </div>
  );
}

function ForecastQuestionRoute({
  params,
}: {
  params: { partId: string; questionId: string };
}) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data, isLoading, isError } = useForecastQuestion(params.questionId);

  // The persisted token loads after first render, so only treat "no token" as signed-out once it has.
  // `persist` is undefined while server-rendering (no localStorage), hence the optional chaining.
  const [isAuthHydrated, setIsAuthHydrated] = useState(false);
  useEffect(() => {
    const { persist } = useAuthStore;
    setIsAuthHydrated(persist?.hasHydrated() ?? true);
    return persist?.onFinishHydration(() => setIsAuthHydrated(true));
  }, []);

  useEffect(() => {
    if (isAuthHydrated && !accessToken) router.replace("/login");
  }, [isAuthHydrated, accessToken, router]);

  if (isError) {
    return (
      <AppShell hideSidebar fullWidth>
        <EmptyState
          title="Không tải được câu hỏi"
          description="Câu hỏi không tồn tại hoặc bạn chưa đăng nhập."
        />
      </AppShell>
    );
  }

  if (isLoading || !data) {
    return (
      <AppShell hideSidebar fullWidth>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingIndicator />
        </div>
      </AppShell>
    );
  }

  return (
    <ForecastQuestionContent
      slug={params.questionId}
      partId={params.partId}
      data={data}
    />
  );
}

export default function ForecastQuestionPage(props: {
  params: { partId: string; questionId: string };
}) {
  return (
    <Suspense
      fallback={
        <AppShell hideSidebar fullWidth>
          <div className="flex min-h-[60vh] items-center justify-center">
            <LoadingIndicator />
          </div>
        </AppShell>
      }
    >
      <ForecastQuestionRoute {...props} />
    </Suspense>
  );
}
