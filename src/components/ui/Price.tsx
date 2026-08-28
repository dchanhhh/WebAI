import { cn } from "@/lib/utils";
import { formatVnd } from "@/lib/money";

// design.md §2.4 — giá KM màu sale, giá gốc line-through muted.
export function Price({
  priceVnd,
  salePriceVnd,
  className,
  size = "base",
}: {
  priceVnd: number;
  salePriceVnd?: number | null;
  className?: string;
  size?: "base" | "lg";
}) {
  const onSale = salePriceVnd != null && salePriceVnd < priceVnd;
  const sizeClass = size === "lg" ? "text-lg" : "text-base";
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-2", sizeClass, className)}>
      {onSale ? (
        <>
          <span className="font-medium text-sale">{formatVnd(salePriceVnd!)}</span>
          <span className="text-sm font-normal text-muted line-through">
            {formatVnd(priceVnd)}
          </span>
        </>
      ) : (
        <span className="font-medium text-ink">{formatVnd(priceVnd)}</span>
      )}
    </span>
  );
}
