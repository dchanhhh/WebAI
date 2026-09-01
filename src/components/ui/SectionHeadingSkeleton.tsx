import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

/** Khớp bố cục SectionHeading.tsx (design.md §5.4) — eyebrow + h2. */
export function SectionHeadingSkeleton({
  align = "center",
  className,
}: {
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-12 lg:mb-16",
        align === "center" ? "mx-auto flex max-w-prose flex-col items-center" : "",
        className,
      )}
    >
      <Skeleton className="mb-2 h-3 w-24" />
      <Skeleton className="h-8 w-56 lg:h-9 lg:w-72" />
    </div>
  );
}
