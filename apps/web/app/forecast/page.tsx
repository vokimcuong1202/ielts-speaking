"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingIndicator } from "@/components/layout/loading-screen";
import { ForecastPageHeader } from "@/components/forecast/forecast-page-header";
import { ForecastToolbar } from "@/components/forecast/forecast-toolbar";
import { ForecastPartTabs } from "@/components/forecast/forecast-part-tabs";
import { ForecastPart1View } from "@/components/forecast/forecast-part1-view";
import { ForecastPart2View } from "@/components/forecast/forecast-part2-view";
import { ForecastPart3View } from "@/components/forecast/forecast-part3-view";
import { useForecastPractice } from "@/hooks/use-forecast-practice";
import type { ForecastGroup, ForecastPartId } from "@/types/forecast";

function sumGroups(groups: ForecastGroup[]) {
  return groups.reduce(
    (totals, group) => ({
      practiced: totals.practiced + group.practicedCount,
      total: totals.total + group.unitCount,
    }),
    { practiced: 0, total: 0 }
  );
}

export default function ForecastPage() {
  const { data, isLoading } = useForecastPractice();
  const [activePartId, setActivePartId] = useState<ForecastPartId>("part1");
  const [hideAnswered, setHideAnswered] = useState(false);
  const [search, setSearch] = useState("");

  if (isLoading || !data) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingIndicator />
        </div>
      </AppShell>
    );
  }

  const activePartTab = data.parts.find((part) => part.id === activePartId);

  function handlePartChange(id: ForecastPartId) {
    setActivePartId(id);
    setSearch("");
  }

  const activeData = activePartId === "custom" ? data.custom : data[activePartId];

  return (
    <AppShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <ForecastPageHeader quarterLabel={data.quarterLabel} partTitle={activeData.pageTitle} />
        <ForecastToolbar
          hideAnswered={hideAnswered}
          onHideAnsweredChange={setHideAnswered}
          search={search}
          onSearchChange={setSearch}
          hideAnsweredLabel={activeData.hideAnsweredLabel}
        />
      </div>

      <ForecastPartTabs parts={data.parts} activePartId={activePartId} onChange={handlePartChange} />

      {activePartId === "part1" ? (
        <ForecastPart1View
          data={data.part1}
          partLabel={activePartTab?.label.toUpperCase() ?? ""}
          hideAnswered={hideAnswered}
          search={search}
        />
      ) : activePartId === "part2" ? (
        <ForecastPart2View
          data={data.part2}
          hideAnswered={hideAnswered}
          search={search}
          totalPracticedCount={sumGroups(data.part2.groups).practiced}
          totalCount={sumGroups(data.part2.groups).total}
        />
      ) : activePartId === "part3" ? (
        <ForecastPart3View
          data={data.part3}
          hideAnswered={hideAnswered}
          search={search}
          totalPracticedCount={sumGroups(data.part3.groups).practiced}
          totalCount={sumGroups(data.part3.groups).total}
        />
      ) : (
        <ForecastPart1View
          data={data.custom}
          partLabel={activePartTab?.label.toUpperCase() ?? ""}
          hideAnswered={hideAnswered}
          search={search}
        />
      )}
    </AppShell>
  );
}
