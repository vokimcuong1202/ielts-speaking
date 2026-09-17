import { Button } from "@/components/ui/button";

export function SidebarProCard() {
  return (
    <div className="rounded-xl bg-brand-50 p-3">
      <p className="text-sm font-bold text-ink-900">Gói Pro</p>
      <p className="mt-0.5 text-xs text-ink-500">Nói không giới hạn · 90.000đ/tháng</p>
      <Button variant="primary" size="sm" className="mt-2.5 w-full">
        Nâng cấp
      </Button>
    </div>
  );
}
