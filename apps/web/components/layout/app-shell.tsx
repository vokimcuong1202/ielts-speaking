"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/cn";

const emptyProgress = { completed: 0, total: 1 };

export function AppShell({ children, mainClassName }: { children: ReactNode; mainClassName?: string }) {
  const { data: user } = useCurrentUser();

  return (
    <div className="flex min-h-screen bg-page">
      <div className="hidden lg:block">
        <Sidebar userName={user?.name ?? ""} progress={user?.sidebarProgress ?? emptyProgress} />
      </div>
      <main className={cn("flex-1 px-4 py-6 sm:px-8 sm:py-8", mainClassName)}>
        <div className="mx-auto flex max-w-6xl flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
