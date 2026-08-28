import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ProductGrid } from "@/components/product/ProductGrid";
import { IconArrowRight } from "@/components/ui/icons";
import { getFeaturedProducts } from "@/lib/products";

export async function LatestCollection() {
  const products = await getFeaturedProducts(4);
  if (products.length === 0) return null;

  return (
    <Section reveal={false}>
      <div className="mb-10 flex items-end justify-between gap-4 lg:mb-14">
        <div>
          <p className="text-overline text-muted mb-2">Bộ sưu tập mới nhất</p>
          <h2 className="text-h2 text-ink">Được yêu thích tuần này</h2>
        </div>
        <Link
          href="/shop"
          className="hidden shrink-0 items-center gap-1.5 text-overline text-ink hover:text-accent sm:inline-flex"
        >
          Xem tất cả <IconArrowRight width={16} height={16} />
        </Link>
      </div>
      <Reveal>
        <ProductGrid products={products} />
      </Reveal>
      <div className="mt-8 text-center sm:hidden">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-overline text-ink">
          Xem tất cả <IconArrowRight width={16} height={16} />
        </Link>
      </div>
    </Section>
  );
}
