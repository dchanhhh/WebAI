import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// design.md §5.4
export function SectionHeading({
  eyebrow,
  title,
  align = "center",
  className,
  children,
}: {
  eyebrow?: string;
  title: string;
  align?: "center" | "left";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mb-12 lg:mb-16",
        align === "center" ? "text-center mx-auto max-w-prose" : "text-left",
        className,
      )}
    >
      {eyebrow ? <p className="text-overline text-muted mb-2">{eyebrow}</p> : null}
      <h2 className="text-h2 text-ink">{title}</h2>
      {children ? <div className="mt-4 text-muted">{children}</div> : null}
    </div>
  );
}
