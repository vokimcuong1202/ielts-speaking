import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CollapsibleProps {
  isOpen: boolean;
  children: ReactNode;
  className?: string;
}

/** Animates its height (and fades) between open and closed; closed content is inert. */
export function Collapsible({ isOpen, children, className }: CollapsibleProps) {
  return (
    <div
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={cn(
        "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none",
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        className,
      )}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}
