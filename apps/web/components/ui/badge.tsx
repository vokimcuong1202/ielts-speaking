import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva("inline-flex items-center gap-1 rounded-full font-semibold", {
  variants: {
    variant: {
      neutral: "bg-page text-ink-500",
      brand: "bg-brand-50 text-brand-700",
      brandSolid: "bg-brand-700 text-white",
      success: "bg-success-bg text-success-text",
      warning: "bg-warning-bg text-warning-text",
      hot: "bg-hot-bg text-hot-text",
      outline: "border border-border-strong text-ink-700",
    },
    size: {
      sm: "px-2 py-0.5 text-[11px] uppercase tracking-wide",
      md: "px-2.5 py-1 text-xs",
      lg: "px-3 py-1.5 text-sm",
    },
  },
  defaultVariants: {
    variant: "neutral",
    size: "md",
  },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
