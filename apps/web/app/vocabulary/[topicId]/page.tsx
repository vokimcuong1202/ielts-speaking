"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingIndicator } from "@/components/layout/loading-screen";
import { TopicDetailHeader } from "@/components/vocabulary/topic-detail-header";
import { TopicCategoryFilterBar } from "@/components/vocabulary/topic-category-filter-bar";
import { TopicWordSection } from "@/components/vocabulary/topic-word-section";
import { VocabularyReviewModal } from "@/components/vocabulary/vocabulary-review-modal";
import { useVocabularyTopicDetail } from "@/hooks/use-vocabulary-topic-detail";
import { toReviewWords } from "@/lib/vocabulary-review";
import type { VocabularyReviewSession, VocabularyWordCategory } from "@/types/vocabulary";

const categories: VocabularyWordCategory[] = ["collocation", "idiom", "phrasalVerb"];

export default function VocabularyTopicDetailPage({ params }: { params: { topicId: string } }) {
  const { data: topic, isLoading } = useVocabularyTopicDetail(params.topicId);
  const [reviewSession, setReviewSession] = useState<VocabularyReviewSession | null>(null);

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingIndicator />
        </div>
      </AppShell>
    );
  }

  if (!topic) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <p className="text-sm text-ink-400">Không tìm thấy chủ đề này.</p>
      </div>
    );
  }

  const handleStartTopicReview = () => {
    setReviewSession({
      scopeLabel: "Chủ đề này",
      contextText: `${topic.titleEn} · ${topic.titleVi}`,
      words: toReviewWords(topic.words),
    });
  };

  return (
    <>
      <AppShell mainClassName="bg-surface">
        <TopicDetailHeader topic={topic} onStartReview={handleStartTopicReview} />

        <TopicCategoryFilterBar totalCount={topic.totalWords} counts={topic.categoryCounts} />

        <div className="flex flex-col gap-8">
          {categories.map((category) => {
            const categoryWords = topic.words.filter((word) => word.category === category);
            if (categoryWords.length === 0) return null;

            return (
              <TopicWordSection
                key={category}
                category={category}
                count={topic.categoryCounts[category]}
                words={categoryWords}
              />
            );
          })}
        </div>
      </AppShell>

      {reviewSession ? <VocabularyReviewModal session={reviewSession} onClose={() => setReviewSession(null)} /> : null}
    </>
  );
}
