"use client";

import { usePathname } from "next/navigation";
import { BookMarked, Headphones, Home, LineChart, Sparkles } from "lucide-react";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarProgressWidget } from "./sidebar-progress-widget";
import { SidebarProCard } from "./sidebar-pro-card";
import { SidebarUser } from "./sidebar-user";
import type { SidebarProgress } from "@/types/user";

const primaryNavItems = [
  { icon: Home, label: "Trang chủ", href: "/dashboard" },
  { icon: Headphones, label: "Thi thử", href: "/thi-thu" },
  { icon: Sparkles, label: "Luyện Forecast", href: "/forecast" },
];

const secondaryNavItems = [
  { icon: BookMarked, label: "Sổ từ vựng", href: "/vocabulary" },
  { icon: LineChart, label: "Tiến bộ", href: "/progress" },
];

export function Sidebar({ userName, progress }: { userName: string; progress: SidebarProgress }) {
  const pathname = usePathname();

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
          {primaryNavItems.map((item) => (
            <SidebarNavItem key={item.href} {...item} active={pathname.startsWith(item.href)} />
          ))}
        </nav>

        <div className="my-4 border-t border-border" />

        <nav className="flex flex-col gap-1">
          {secondaryNavItems.map((item) => (
            <SidebarNavItem key={item.href} {...item} active={pathname.startsWith(item.href)} />
          ))}
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
