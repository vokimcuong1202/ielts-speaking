"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/stores/auth.store";

const menuItemClass =
  "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-ink-700 hover:bg-page";

export function SidebarUser({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleLogout() {
    setOpen(false);
    setAccessToken(null);
    queryClient.clear();
    router.replace("/login");
  }

  return (
    <div ref={containerRef} className="relative">
      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 right-0 z-30 mb-2 rounded-xl border border-border bg-white p-1.5 shadow-lg"
        >
          <Link href="/settings" role="menuitem" onClick={() => setOpen(false)} className={menuItemClass}>
            <Settings className="h-4 w-4 text-ink-400" strokeWidth={2} />
            Cài đặt
          </Link>
          <button type="button" role="menuitem" onClick={handleLogout} className={cn(menuItemClass, "text-danger-text hover:bg-danger-bg")}>
            <LogOut className="h-4 w-4" strokeWidth={2} />
            Đăng xuất
          </button>
        </div>
      )}

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-1 py-1.5 text-left hover:bg-page"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
          {initial}
        </span>
        <span className="flex-1 text-sm font-semibold text-ink-900">{name}</span>
        <ChevronDown className={cn("h-4 w-4 text-ink-400 transition-transform", open && "rotate-180")} />
      </button>
    </div>
  );
}
