import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/constants";

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "sale" | "accent";
}) {
  const tones = {
    neutral: "bg-surface-2 text-ink-soft",
    sale: "bg-sale text-white",
    accent: "bg-accent text-accent-fg",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium uppercase leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

// design.md §5.5
const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "bg-surface-2 text-ink-soft",
  confirmed: "bg-info/10 text-info",
  shipping: "bg-accent/10 text-accent-hover",
  completed: "bg-success/10 text-success",
  cancelled: "bg-error/10 text-error",
};

export function OrderStatusBadge({
  status,
  label,
}: {
  status: OrderStatus;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium uppercase leading-none",
        STATUS_STYLE[status],
      )}
    >
      {label}
    </span>
  );
}
