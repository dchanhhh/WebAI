import { ProductCard } from "@/components/product/ProductCard";
import type { ProductListItem } from "@/lib/products";
import { cn } from "@/lib/utils";

// design.md §4.2 — grid-cols-2 -> md:3 -> lg:4
export function ProductGrid({
  products,
  className,
}: {
  products: ProductListItem[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8",
        className,
      )}
    >
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
