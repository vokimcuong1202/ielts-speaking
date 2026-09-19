import { Badge } from "@/components/ui/badge";

export function ForecastClusterTip({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-warning-bg bg-warning-bg/40 p-4">
      <Badge variant="warning" size="sm" className="w-fit">
        Gợi ý
      </Badge>
      <p className="text-sm text-ink-700">{text}</p>
    </div>
  );
}
