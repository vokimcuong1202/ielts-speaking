"use client";

import { useMemo, useState } from "react";
import { ForecastGroupNav } from "./forecast-group-nav";
import { ForecastGroupSidebar, type ForecastGroupSidebarEntry } from "./forecast-group-sidebar";
import { ForecastSidebarProgressCard } from "./forecast-sidebar-progress-card";
import { ForecastCueCardDetail } from "./forecast-cue-card-detail";
import { ForecastCueCardRow } from "./forecast-cue-card-row";
import type { ForecastCueCard, ForecastPart2Data } from "@/types/forecast";

const ROW_CAP = 2;

function matchesSearch(cueCard: ForecastCueCard, query: string): boolean {
  if (!query) return true;
  return cueCard.title.toLowerCase().includes(query.trim().toLowerCase());
}

interface ForecastPart2ViewProps {
  data: ForecastPart2Data;
  hideAnswered: boolean;
  search: string;
  totalPracticedCount: number;
  totalCount: number;
}

export function ForecastPart2View({ data, hideAnswered, search, totalPracticedCount, totalCount }: ForecastPart2ViewProps) {
  const [activeGroupId, setActiveGroupId] = useState(data.groups[0]?.id ?? "");
  const [activeCueCardId, setActiveCueCardId] = useState<string | null>(null);

  const activeGroupIndex = data.groups.findIndex((group) => group.id === activeGroupId);
  const activeGroup = data.groups[activeGroupIndex] ?? data.groups[0];
  const nextGroup = activeGroupIndex >= 0 ? data.groups[activeGroupIndex + 1] : undefined;

  const groupCueCards = data.cueCardsByGroup[activeGroup?.id ?? ""] ?? [];

  const filteredCueCards = useMemo(
    () => groupCueCards.filter((cueCard) => matchesSearch(cueCard, search)),
    [groupCueCards, search]
  );
  const visibleCueCards = hideAnswered ? filteredCueCards.filter((cueCard) => !cueCard.practiceSummary) : filteredCueCards;

  const activeId = activeCueCardId && visibleCueCards.some((c) => c.id === activeCueCardId) ? activeCueCardId : (visibleCueCards[0]?.id ?? null);
  const activeCard = visibleCueCards.find((cueCard) => cueCard.id === activeId) ?? null;
  const otherCards = visibleCueCards.filter((cueCard) => cueCard.id !== activeId).slice(0, ROW_CAP);
  const remaining = visibleCueCards.length - (activeCard ? 1 : 0) - otherCards.length;
  const hiddenByFilterCount = filteredCueCards.length - visibleCueCards.length;

  const sidebarItems: ForecastGroupSidebarEntry[] = filteredCueCards.map((cueCard) => ({
    id: cueCard.id,
    title: cueCard.title,
    badge: cueCard.practiceSummary
      ? { label: `band ${cueCard.practiceSummary.latestBand.toFixed(1)}`, variant: "warning" }
      : cueCard.tag,
    metaLabel: cueCard.sidebarMetaLabel,
  }));

  function handleSelectGroup(id: string) {
    setActiveGroupId(id);
    setActiveCueCardId(null);
  }

  let footerLeft: string | null = null;
  if (hideAnswered && hiddenByFilterCount > 0) {
    footerLeft = `Đang ẩn ${hiddenByFilterCount} đề đã luyện trong nhóm này.`;
  } else if (remaining > 0 && activeGroup) {
    footerLeft = `Còn ${remaining} đề trong nhóm ${activeGroup.label}.`;
  }

  return (
    <>
      <ForecastGroupNav groups={data.groups} activeGroupId={activeGroup?.id ?? ""} onSelectGroup={handleSelectGroup} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <ForecastSidebarProgressCard
            title="Quý 3/2026"
            practicedCount={totalPracticedCount}
            totalCount={totalCount}
            unitLabel="đề forecast"
          />
          <ForecastGroupSidebar
            groupLabel={activeGroup?.label ?? ""}
            unitCount={activeGroup?.unitCount ?? 0}
            unitLabel={activeGroup?.unitLabel ?? "đề"}
            items={sidebarItems}
            activeItemId={activeId}
            onSelectItem={setActiveCueCardId}
            addCustomLabel="+ Thêm đề bạn gặp trong phòng thi"
          />
        </div>

        <div className="flex flex-col gap-4">
          {!activeCard ? (
            <p className="rounded-2xl border border-dashed border-border-strong px-6 py-12 text-center text-sm text-ink-400">
              Không tìm thấy đề phù hợp.
            </p>
          ) : (
            <>
              <ForecastCueCardDetail cueCard={activeCard} />
              {otherCards.map((cueCard) => (
                <ForecastCueCardRow key={cueCard.id} cueCard={cueCard} onSelect={setActiveCueCardId} />
              ))}
            </>
          )}

          {footerLeft || nextGroup ? (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm">
              <span className="text-ink-400">{footerLeft}</span>
              {nextGroup ? (
                <button
                  type="button"
                  onClick={() => handleSelectGroup(nextGroup.id)}
                  className="ml-auto cursor-pointer font-semibold text-brand-700 hover:underline"
                >
                  Sang nhóm {nextGroup.label} · {nextGroup.unitCount} {nextGroup.unitLabel} →
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
