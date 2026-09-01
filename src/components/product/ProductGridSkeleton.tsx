import { ProductCardSkeleton } from "@/components/product/ProductCardSkeleton";
import { cn } from "@/lib/utils";

/** Khớp bố cục ProductGrid.tsx (design.md §4.2) — grid-cols-2 -> md:3 -> lg:4. */
export function ProductGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
