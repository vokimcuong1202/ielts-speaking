import { Badge } from "@/components/ui/badge";

export function PracticeSetupHeader({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-extrabold text-ink-900">Chỉnh buổi tập theo ý bạn</h2>
        <p className="mt-1 text-sm text-ink-500">Hai lựa chọn, đổi lúc nào cũng được.</p>
      </div>

      <Badge variant="brand" size="md">
        Bước {currentStep} / {totalSteps}
      </Badge>
    </div>
  );
}
