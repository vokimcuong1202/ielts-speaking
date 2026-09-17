import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
}

export function SidebarNavItem({ icon: Icon, label, active }: SidebarNavItemProps) {
  return (
    <a
      href="#"
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        active ? "bg-brand-50 text-brand-700" : "text-ink-500 hover:bg-page hover:text-ink-900"
      )}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      {label}
    </a>
  );
}
