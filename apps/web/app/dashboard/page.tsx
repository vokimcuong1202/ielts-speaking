"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingIndicator } from "@/components/layout/loading-screen";
import { PageHeader } from "@/components/dashboard/page-header";
import { TodaySessionCard } from "@/components/dashboard/today-session-card";
import { TestScoreCard } from "@/components/dashboard/test-score-card";
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap";
import { WeekStreakCard } from "@/components/dashboard/week-streak-card";
import { ForecastPracticeCard } from "@/components/dashboard/forecast-practice-card";
import { useDashboardHome } from "@/hooks/use-dashboard-home";
import { useAuthStore } from "@/stores/auth.store";

export default function DashboardPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data, isLoading } = useDashboardHome();

  useEffect(() => {
    if (!accessToken) router.replace("/login");
  }, [accessToken, router]);

  if (isLoading || !data) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingIndicator />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader user={data.user} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodaySessionCard session={data.todaySession} />
        </div>
        <TestScoreCard score={data.testScore} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <ForecastPracticeCard questions={data.forecastQuestions} />
        <div className="flex min-w-0 flex-col gap-6">
          <WeekStreakCard streak={data.weekStreak} />
          <ActivityHeatmap heatmap={data.heatmap} />
        </div>
      </div>
    </AppShell>
  );
}
