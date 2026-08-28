import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

// design.md §4.3 — padding dọc 64px (mobile) -> 96px (lg).
// design.md §3.3 — nhịp nền bg -> surface -> bg xen kẽ.
export function Section({
  children,
  surface = false,
  id,
  className,
  containerClassName,
  reveal = true,
}: {
  children: ReactNode;
  surface?: boolean;
  id?: string;
  className?: string;
  containerClassName?: string;
  reveal?: boolean;
}) {
  const inner = <Container className={containerClassName}>{children}</Container>;
  return (
    <section
      id={id}
      className={cn("py-16 lg:py-24", surface ? "bg-surface" : "bg-bg", className)}
    >
      {reveal ? <Reveal>{inner}</Reveal> : inner}
    </section>
  );
}
