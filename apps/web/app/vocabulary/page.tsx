"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingIndicator } from "@/components/layout/loading-screen";
import { VocabularyHeader } from "@/components/vocabulary/vocabulary-header";
import { SectionTabs, type VocabularyTabId } from "@/components/vocabulary/section-tabs";
import { StatusFilterBar } from "@/components/vocabulary/status-filter-bar";
import { VocabularyGroupCard } from "@/components/vocabulary/vocabulary-group-card";
import { ReviewSummaryCard } from "@/components/vocabulary/review-summary-card";
import { TopicOverviewCard } from "@/components/vocabulary/topic-overview-card";
import { TopicToolbar } from "@/components/vocabulary/topic-toolbar";
import { TopicCard } from "@/components/vocabulary/topic-card";
import { VocabularyReviewModal } from "@/components/vocabulary/vocabulary-review-modal";
import { useVocabularyNotebook } from "@/hooks/use-vocabulary-notebook";
import { toReviewWords } from "@/lib/vocabulary-review";
import type { VocabularyGroup, VocabularyReviewSession } from "@/types/vocabulary";

export default function VocabularyPage() {
  const { data, isLoading } = useVocabularyNotebook();
  const [activeTabId, setActiveTabId] = useState<VocabularyTabId>("suggested");
  const [reviewSession, setReviewSession] = useState<VocabularyReviewSession | null>(null);

  if (isLoading || !data) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingIndicator />
        </div>
      </AppShell>
    );
  }

  const sourceBadgeByType = {
    forecast: { label: "ĐỀ FORECAST", variant: "brand" as const },
    test: { label: "BÀI THI THỬ", variant: "neutral" as const },
  };

  const handleStartGroupReview = (group: VocabularyGroup) => {
    const source = sourceBadgeByType[group.sourceType];
    setReviewSession({
      scopeLabel: "Câu hỏi này",
      contextBadgeLabel: source.label,
      contextBadgeVariant: source.variant,
      contextText: group.question,
      words: toReviewWords(group.words),
    });
  };

  const handleStartDailyReview = () => {
    const dueWords = data.groups.flatMap((group) => group.words).slice(0, data.reviewSummary.dueTodayCount);
    setReviewSession({
      scopeLabel: "Hôm nay",
      words: toReviewWords(dueWords),
    });
  };

  return (
    <>
      <AppShell mainClassName="bg-surface">
        {activeTabId === "suggested" ? (
          <VocabularyHeader
            title="Từ vựng gợi ý theo chủ đề"
            description="Collocation, idiom và phrasal verb hay gặp trong IELTS Speaking. Chọn một chủ đề để mở trang từ vựng riêng của chủ đề đó."
          >
            <TopicOverviewCard overview={data.topicOverview} />
          </VocabularyHeader>
        ) : (
          <VocabularyHeader
            title="Từ vựng đã lưu"
            description="Xếp theo đúng câu hỏi bạn đang luyện khi bấm lưu, kèm nghĩa tiếng Việt ngay dưới mỗi từ."
          >
            <ReviewSummaryCard reviewSummary={data.reviewSummary} onStartReview={handleStartDailyReview} />
          </VocabularyHeader>
        )}

        <SectionTabs activeTabId={activeTabId} onChange={setActiveTabId} />

        {activeTabId === "suggested" ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-ink-900">{data.topics.length} chủ đề</h2>
              <TopicToolbar />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <StatusFilterBar counts={data.filterCounts} />

            <div className="flex flex-col gap-4">
              {data.groups.map((group) => (
                <VocabularyGroupCard key={group.id} group={group} onStartReview={handleStartGroupReview} />
              ))}
            </div>

            {data.remainingGroupsCount > 0 ? (
              <button type="button" className="mx-auto cursor-pointer text-sm font-semibold text-brand-700 hover:underline">
                Xem thêm {data.remainingGroupsCount} câu đã lưu từ →
              </button>
            ) : null}
          </div>
        )}
      </AppShell>

      {reviewSession ? <VocabularyReviewModal session={reviewSession} onClose={() => setReviewSession(null)} /> : null}
    </>
  );
}
