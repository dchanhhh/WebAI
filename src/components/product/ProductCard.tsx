import Link from "next/link";
import Image from "next/image";
import { ImageWithSkeleton } from "@/components/ui/ImageWithSkeleton";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { discountPercent } from "@/lib/money";
import type { ProductListItem } from "@/lib/products";

// design.md §5.3
export function ProductCard({ product }: { product: ProductListItem }) {
  const primary = product.images[0];
  const secondary = product.images[1] ?? product.images[0];
  const off = product.salePriceVnd
    ? discountPercent(product.priceVnd, product.salePriceVnd)
    : 0;

  return (
    <div className="group flex flex-col">
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15"
      >
        {primary ? (
          <ImageWithSkeleton
            src={primary.url}
            alt={primary.alt || product.name}
            fill
            sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
            className="object-cover"
          />
        ) : null}
        {secondary && secondary !== primary ? (
          <Image
            src={secondary.url}
            alt=""
            fill
            aria-hidden
            sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-200 ease-standard group-hover:opacity-100"
          />
        ) : null}

        <div className="absolute left-0 top-0 flex flex-col gap-1 p-2">
          {off > 0 ? <Badge tone="sale">-{off}%</Badge> : null}
          {product.isNew ? <Badge tone="neutral">Mới</Badge> : null}
        </div>
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <h3 className="line-clamp-2 text-h4 text-ink">
          <Link href={`/san-pham/${product.slug}`} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1.5">
          <Price priceVnd={product.priceVnd} salePriceVnd={product.salePriceVnd} />
        </div>
        {/* Mobile: luôn hiện. Desktop: hiện khi hover card (design.md §5.3) */}
        <div className="mt-3 md:opacity-0 md:transition-opacity md:duration-150 md:group-hover:opacity-100 md:focus-within:opacity-100">
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
