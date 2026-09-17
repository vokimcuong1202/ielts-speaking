"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/dashboard/page-header";
import { TodaySessionCard } from "@/components/dashboard/today-session-card";
import { TestScoreCard } from "@/components/dashboard/test-score-card";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { WeekStreakCard } from "@/components/dashboard/week-streak-card";
import { ForecastPracticeCard } from "@/components/dashboard/forecast-practice-card";
import { VocabularyCard } from "@/components/dashboard/vocabulary-card";
import { useDashboardHome } from "@/hooks/use-dashboard-home";

export default function DashboardPage() {
  const { data, isLoading } = useDashboardHome();

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <p className="text-sm text-ink-400">Đang tải…</p>
      </div>
    );
  }

  return (
    <AppShell userName={data.user.name} sidebarProgress={data.sidebarProgress}>
      <PageHeader user={data.user} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodaySessionCard session={data.todaySession} />
        </div>
        <TestScoreCard score={data.testScore} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <ActivityHeatmap heatmap={data.heatmap} />
        <WeekStreakCard streak={data.weekStreak} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <ForecastPracticeCard questions={data.forecastQuestions} />
        <VocabularyCard vocabulary={data.vocabulary} />
      </div>
    </AppShell>
  );
}
