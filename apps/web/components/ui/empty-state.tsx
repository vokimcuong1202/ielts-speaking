import type { ReactNode } from "react";
import Link from "next/link";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-border-strong bg-white px-6 py-14 text-center",
        className
      )}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        {icon ?? <Inbox className="h-7 w-7" strokeWidth={1.75} />}
      </span>
      <h3 className="mt-4 text-lg font-bold text-ink-900">{title}</h3>
      {description ? <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p> : null}

      {action ? (
        action.href ? (
          <Link href={action.href} className="mt-5">
            <Button variant="primary" size="md">
              {action.label}
            </Button>
          </Link>
        ) : (
          <Button variant="primary" size="md" className="mt-5" onClick={action.onClick}>
            {action.label}
          </Button>
        )
      ) : null}
    </div>
  );
}
