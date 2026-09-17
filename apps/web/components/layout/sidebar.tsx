import { BookMarked, Headphones, Home, LineChart, Sparkles } from "lucide-react";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarProgressWidget } from "./sidebar-progress-widget";
import { SidebarProCard } from "./sidebar-pro-card";
import { SidebarUser } from "./sidebar-user";
import type { SidebarProgress } from "@/types/dashboard";

export function Sidebar({ userName, progress }: { userName: string; progress: SidebarProgress }) {
  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col justify-between border-r border-border bg-surface px-4 py-5">
      <div>
        <div className="flex items-center gap-2 px-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-sm font-bold text-white">
            S
          </span>
          <span className="text-base font-bold text-ink-900">SpeakPrep</span>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          <SidebarNavItem icon={Home} label="Trang chủ" active />
          <SidebarNavItem icon={Headphones} label="Thi thử" />
          <SidebarNavItem icon={Sparkles} label="Luyện Forecast" />
        </nav>

        <div className="my-4 border-t border-border" />

        <nav className="flex flex-col gap-1">
          <SidebarNavItem icon={BookMarked} label="Sổ từ vựng" />
          <SidebarNavItem icon={LineChart} label="Tiến bộ" />
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <SidebarProgressWidget progress={progress} />
        <SidebarProCard />
        <div className="border-t border-border pt-3">
          <SidebarUser name={userName} />
        </div>
      </div>
    </aside>
  );
}
