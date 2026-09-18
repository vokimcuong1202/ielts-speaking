import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VocabularyWordChip } from "./vocabulary-word-chip";
import type { VocabularyGroup } from "@/types/vocabulary";

const sourceBadgeProps: Record<VocabularyGroup["sourceType"], { variant: "brand" | "neutral"; label: string }> = {
  forecast: { variant: "brand", label: "ĐỀ FORECAST" },
  test: { variant: "neutral", label: "BÀI THI THỬ" },
};

interface VocabularyGroupCardProps {
  group: VocabularyGroup;
  onStartReview: (group: VocabularyGroup) => void;
}

export function VocabularyGroupCard({ group, onStartReview }: VocabularyGroupCardProps) {
  const source = sourceBadgeProps[group.sourceType];

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={source.variant} size="sm">
            {source.label}
          </Badge>
          <p className="text-base font-bold text-ink-900">{group.question}</p>
        </div>
        <p className="shrink-0 text-xs text-ink-400">
          {group.dateLabel} · {group.partLabel}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {group.words.map((entry) => (
          <VocabularyWordChip key={entry.id} entry={entry} />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
        <p className="text-sm text-ink-500">{group.words.length} từ đã lưu ở câu này</p>
        <button
          type="button"
          onClick={() => onStartReview(group)}
          className="cursor-pointer rounded-full border border-border-strong px-3.5 py-1.5 text-sm font-semibold text-ink-700 hover:bg-page"
        >
          Ôn {group.words.length} từ này
        </button>
      </div>
    </Card>
  );
}
