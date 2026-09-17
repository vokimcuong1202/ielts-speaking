import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import type { SidebarProgress } from "@/types/dashboard";

interface AppShellProps {
  userName: string;
  sidebarProgress: SidebarProgress;
  children: ReactNode;
}

export function AppShell({ userName, sidebarProgress, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-page">
      <div className="hidden lg:block">
        <Sidebar userName={userName} progress={sidebarProgress} />
      </div>
      <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">{children}</div>
      </main>
    </div>
  );
}
