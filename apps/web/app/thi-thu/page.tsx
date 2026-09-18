"use client";

import { AppShell } from "@/components/layout/app-shell";
import { LoadingIndicator } from "@/components/layout/loading-screen";
import { PageHeader } from "@/components/thi-thu/page-header";
import { TestTypeTabs } from "@/components/thi-thu/test-type-tabs";
import { HistoryFilterBar } from "@/components/thi-thu/history-filter-bar";
import { AttemptCard } from "@/components/thi-thu/attempt-card";
import { useTestHistory } from "@/hooks/use-test-history";

export default function ThiThuPage() {
  const { data, isLoading } = useTestHistory();

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
      <PageHeader activity={data.activity} />

      <TestTypeTabs />

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-ink-900">Lịch sử thi thử</h2>
          <HistoryFilterBar totalCount={data.activity.totalAttempts} />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {data.attempts.map((attempt) => (
            <AttemptCard key={attempt.id} attempt={attempt} />
          ))}
        </div>

        {data.totalAttemptsOlder > 0 ? (
          <button
            type="button"
            className="mt-4 w-full cursor-pointer rounded-xl border border-border py-3 text-sm font-semibold text-ink-700 hover:bg-page"
          >
            Xem thêm {data.totalAttemptsOlder} lần thi cũ hơn
          </button>
        ) : null}
      </div>
    </AppShell>
  );
}
