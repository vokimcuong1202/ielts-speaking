"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingIndicator } from "@/components/layout/loading-screen";
import { PageHeader } from "@/components/thi-thu/page-header";
import { TestTypeTabs } from "@/components/thi-thu/test-type-tabs";
import { HistoryFilterBar } from "@/components/thi-thu/history-filter-bar";
import { AttemptCard } from "@/components/thi-thu/attempt-card";
import { useTestHistory } from "@/hooks/use-test-history";
import { useAuthStore } from "@/stores/auth.store";
import type { TestHistoryFilter } from "@/types/test-history";

const PAGE_SIZE = 10;

export default function ThiThuPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const [filter, setFilter] = useState<TestHistoryFilter>("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { data, isLoading, isPlaceholderData } = useTestHistory({
    type: filter === "all" ? undefined : filter,
    limit,
  });

  useEffect(() => {
    if (!accessToken) router.replace("/login");
  }, [accessToken, router]);

  const changeFilter = (next: TestHistoryFilter) => {
    setFilter(next);
    setLimit(PAGE_SIZE);
  };

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
          <HistoryFilterBar counts={data.counts} value={filter} onChange={changeFilter} />
        </div>

        <div className="mt-4 flex flex-col gap-4">
          {data.attempts.map((attempt) => (
            <AttemptCard key={attempt.id} attempt={attempt} />
          ))}
        </div>

        {data.totalAttemptsOlder > 0 ? (
          <button
            type="button"
            disabled={isPlaceholderData}
            onClick={() => setLimit((current) => current + PAGE_SIZE)}
            className="mt-4 w-full cursor-pointer rounded-xl border border-border py-3 text-sm font-semibold text-ink-700 hover:bg-page disabled:cursor-wait disabled:opacity-60"
          >
            Xem thêm {data.totalAttemptsOlder} lần thi cũ hơn
          </button>
        ) : null}
      </div>
    </AppShell>
  );
}
