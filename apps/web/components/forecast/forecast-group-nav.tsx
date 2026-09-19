import { ForecastGroupNavCard } from "./forecast-group-nav-card";
import type { ForecastGroup } from "@/types/forecast";

interface ForecastGroupNavProps {
  groups: ForecastGroup[];
  activeGroupId: string;
  onSelectGroup: (id: string) => void;
}

export function ForecastGroupNav({ groups, activeGroupId, onSelectGroup }: ForecastGroupNavProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {groups.map((group) => (
        <ForecastGroupNavCard key={group.id} group={group} isActive={group.id === activeGroupId} onSelect={onSelectGroup} />
      ))}
    </div>
  );
}
