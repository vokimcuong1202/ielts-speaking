"use client";

import { useMemo, useState } from "react";
import { ForecastGroupNav } from "./forecast-group-nav";
import { ForecastGroupSidebar, type ForecastGroupSidebarEntry } from "./forecast-group-sidebar";
import { ForecastSidebarProgressCard } from "./forecast-sidebar-progress-card";
import { ForecastClusterCard } from "./forecast-cluster-card";
import type { ForecastFollowUpCluster, ForecastPart3Data } from "@/types/forecast";

const CARD_CAP = 3;

function matchesSearch(cluster: ForecastFollowUpCluster, query: string): boolean {
  if (!query) return true;
  const normalizedQuery = query.trim().toLowerCase();
  if (cluster.sourceTitle.toLowerCase().includes(normalizedQuery)) return true;
  return cluster.questions.some((question) => question.title.toLowerCase().includes(normalizedQuery));
}

interface ForecastPart3ViewProps {
  data: ForecastPart3Data;
  hideAnswered: boolean;
  search: string;
  totalPracticedCount: number;
  totalCount: number;
}

export function ForecastPart3View({ data, hideAnswered, search, totalPracticedCount, totalCount }: ForecastPart3ViewProps) {
  const [activeGroupId, setActiveGroupId] = useState(data.groups[0]?.id ?? "");
  const [activeClusterId, setActiveClusterId] = useState<string | null>(null);

  const activeGroupIndex = data.groups.findIndex((group) => group.id === activeGroupId);
  const activeGroup = data.groups[activeGroupIndex] ?? data.groups[0];
  const nextGroup = activeGroupIndex >= 0 ? data.groups[activeGroupIndex + 1] : undefined;

  const groupClusters = data.clustersByGroup[activeGroup?.id ?? ""] ?? [];

  const filteredClusters = useMemo(
    () => groupClusters.filter((cluster) => matchesSearch(cluster, search)),
    [groupClusters, search]
  );

  const activeId = activeClusterId && filteredClusters.some((c) => c.id === activeClusterId) ? activeClusterId : (filteredClusters[0]?.id ?? null);
  const otherClusters = filteredClusters.filter((cluster) => cluster.id !== activeId).slice(0, CARD_CAP - 1);
  const shownClusters = filteredClusters.filter((cluster) => cluster.id === activeId || otherClusters.includes(cluster));
  const remaining = filteredClusters.length - shownClusters.length;

  const sidebarItems: ForecastGroupSidebarEntry[] = filteredClusters.map((cluster) => ({
    id: cluster.id,
    title: cluster.sourceTitle,
    badge: cluster.practiceSummary
      ? { label: `band ${cluster.practiceSummary.latestBand.toFixed(1)}`, variant: "warning" }
      : cluster.sidebarBadge,
    metaLabel: cluster.sidebarMetaLabel,
  }));

  function handleSelectGroup(id: string) {
    setActiveGroupId(id);
    setActiveClusterId(null);
  }

  const footerLeft = remaining > 0 && activeGroup ? `Còn ${remaining} chùm trong nhóm ${activeGroup.label}.` : null;

  return (
    <>
      <ForecastGroupNav groups={data.groups} activeGroupId={activeGroup?.id ?? ""} onSelectGroup={handleSelectGroup} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <ForecastSidebarProgressCard
            title="Part 3 quý này"
            practicedCount={totalPracticedCount}
            totalCount={totalCount}
            unitLabel="chùm câu hỏi"
          />
          <ForecastGroupSidebar
            groupLabel={activeGroup?.label ?? ""}
            unitCount={activeGroup?.unitCount ?? 0}
            unitLabel={activeGroup?.unitLabel ?? "chùm"}
            items={sidebarItems}
            activeItemId={activeId}
            onSelectItem={setActiveClusterId}
            addCustomLabel="+ Thêm câu Part 3 bạn gặp"
          />
        </div>

        <div className="flex flex-col gap-4">
          {shownClusters.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border-strong px-6 py-12 text-center text-sm text-ink-400">
              Không tìm thấy chùm câu hỏi phù hợp.
            </p>
          ) : (
            shownClusters.map((cluster) => (
              <ForecastClusterCard key={cluster.id} cluster={cluster} isActive={cluster.id === activeId} hideAnswered={hideAnswered} />
            ))
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
