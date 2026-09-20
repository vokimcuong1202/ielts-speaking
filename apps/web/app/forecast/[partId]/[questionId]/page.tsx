"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingIndicator } from "@/components/layout/loading-screen";
import { EmptyState } from "@/components/ui/empty-state";
import { QuestionHeader } from "@/components/forecast-question/question-header";
import { LatestAttemptCard } from "@/components/forecast-question/latest-attempt-card";
import { PreviousAttemptsList } from "@/components/forecast-question/previous-attempts-list";
import { PracticeDock } from "@/components/forecast-question/practice-dock";
import { VocabularyPanel } from "@/components/forecast-question/vocabulary-panel";
import { useForecastQuestion, useForecastQuestionActions } from "@/hooks/use-forecast-question";
import { useRecordAttempt } from "@/hooks/use-record-attempt";
import { useAuthStore } from "@/stores/auth.store";
import type { ForecastQuestionPractice } from "@/types/forecast-question";

function ForecastQuestionContent({ slug, partId, data }: { slug: string; partId: string; data: ForecastQuestionPractice }) {
  const { bookmark, saveWord, saveWords, removeWord, reportAttempt, refresh } = useForecastQuestionActions(slug, data.id);
  const record = useRecordAttempt({ questionId: data.id, part: data.partId, onSubmitted: refresh });
  const [latest, ...previous] = data.attempts;

  return (
    <AppShell
      hideSidebar
      fullWidth
      mainClassName="lg:px-6"
      footer={
        <PracticeDock
          partId={partId}
          position={data.position}
          total={data.total}
          topicLabel={data.topicLabel}
          remainingToday={data.quota.remainingToday}
          ideaSteps={data.ideaSteps}
          sampleAnswers={data.sampleAnswers}
          record={{ state: record.state, elapsedSeconds: record.elapsedSeconds, error: record.error, onToggle: record.toggle }}
          previous={data.previous}
          next={data.next}
        />
      }
    >
      <QuestionHeader
        partLabel={data.partLabel}
        title={data.title}
        isBookmarked={data.isBookmarked}
        onToggleBookmark={() => bookmark.mutate(!data.isBookmarked)}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-w-0 flex-col gap-4">
          {latest ? (
            <>
              <LatestAttemptCard
                attempt={latest}
                onReport={(reason) => reportAttempt.mutateAsync({ attemptId: latest.id, reason })}
              />
              <PreviousAttemptsList attempts={previous} />
            </>
          ) : (
            <EmptyState
              title="Bạn chưa luyện câu này"
              description="Bấm “Ghi âm lại câu này” bên dưới để nói câu trả lời đầu tiên và nhận điểm ngay."
            />
          )}
        </div>
        <VocabularyPanel
          vocabularyByBand={data.vocabularyByBand}
          onSave={(vocabItemId) => saveWord.mutateAsync(vocabItemId)}
          onRemove={(userVocabId) => removeWord.mutateAsync(userVocabId)}
          onSaveMany={(vocabItemIds) => saveWords.mutateAsync(vocabItemIds)}
        />
      </div>
    </AppShell>
  );
}

export default function ForecastQuestionPage({ params }: { params: { partId: string; questionId: string } }) {
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
        <EmptyState title="Không tải được câu hỏi" description="Câu hỏi không tồn tại hoặc bạn chưa đăng nhập." />
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

  return <ForecastQuestionContent slug={params.questionId} partId={params.partId} data={data} />;
}
