"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/cn";

const emptyProgress = { completed: 0, total: 1 };

interface AppShellProps {
  children: ReactNode;
  mainClassName?: string;
  hideSidebar?: boolean;
  fullWidth?: boolean;
  footer?: ReactNode;
}

export function AppShell({ children, mainClassName, hideSidebar = false, fullWidth = false, footer }: AppShellProps) {
  const { data: user } = useCurrentUser();

  return (
    <div className="flex min-h-screen bg-page">
      {hideSidebar ? null : (
        <div className="hidden lg:block">
          <Sidebar userName={user?.name ?? ""} progress={user?.sidebarProgress ?? emptyProgress} />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <main className={cn("flex-1 px-4 py-6 sm:px-8 sm:py-8", mainClassName)}>
          <div className={cn("mx-auto flex flex-col gap-6", fullWidth ? "w-full" : "max-w-6xl")}>{children}</div>
        </main>
        {footer ? <div className="sticky bottom-0 z-10">{footer}</div> : null}
      </div>
    </div>
  );
}
