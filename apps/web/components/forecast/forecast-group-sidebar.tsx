import { ForecastGroupSidebarItem } from "./forecast-group-sidebar-item";
import { ForecastAddCustomButton } from "./forecast-add-custom-button";
import type { ForecastBadge } from "@/types/forecast";

export interface ForecastGroupSidebarEntry {
  id: string;
  title: string;
  badge?: ForecastBadge;
  metaLabel: string;
}

interface ForecastGroupSidebarProps {
  groupLabel: string;
  unitCount: number;
  unitLabel: string;
  items: ForecastGroupSidebarEntry[];
  activeItemId: string | null;
  onSelectItem: (id: string) => void;
  addCustomLabel: string;
}

export function ForecastGroupSidebar({
  groupLabel,
  unitCount,
  unitLabel,
  items,
  activeItemId,
  onSelectItem,
  addCustomLabel,
}: ForecastGroupSidebarProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-bold tracking-wide text-ink-400 uppercase">
        Nhóm {groupLabel} · {unitCount} {unitLabel}
      </p>

      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border-strong px-4 py-6 text-center text-sm text-ink-400">
            Không có đề phù hợp.
          </p>
        ) : (
          items.map((item) => (
            <ForecastGroupSidebarItem
              key={item.id}
              id={item.id}
              title={item.title}
              badge={item.badge}
              metaLabel={item.metaLabel}
              isActive={item.id === activeItemId}
              onSelect={onSelectItem}
            />
          ))
        )}
      </div>

      <ForecastAddCustomButton label={addCustomLabel} />
    </div>
  );
}
