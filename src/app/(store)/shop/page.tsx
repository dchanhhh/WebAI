import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import { ShopFilters } from "@/components/product/ShopFilters";
import { SortSelect } from "@/components/product/SortSelect";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { listProducts, getAllCategories } from "@/lib/products";
import {
  parseShopQuery,
  priceBounds,
  buildShopHref,
  type RawSearchParams,
} from "@/lib/shop-query";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description: "Toàn bộ sản phẩm của Nhà May — đầm, áo, quần, chân váy, giày dép và phụ kiện.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const query = parseShopQuery(sp);
  const { priceMin, priceMax } = priceBounds(query.price);

  const [categories, result] = await Promise.all([
    getAllCategories(),
    listProducts({
      categorySlug: query.category,
      sort: query.sort,
      priceMin,
      priceMax,
      onSale: query.onSale,
      isNew: query.isNew,
      search: query.q,
      page: query.page,
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === query.category);
  const heading = activeCategory?.name ?? "Tất cả sản phẩm";

  return (
    <>
      <PageHeader
        eyebrow="Cửa hàng"
        title={heading}
        breadcrumb={[{ label: "Sản phẩm", href: "/shop" }, ...(activeCategory ? [{ label: activeCategory.name }] : [])]}
        description={query.q ? `Kết quả cho “${query.q}”` : undefined}
      />

      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <ShopFilters categories={categories} query={query} />

          <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                {result.total} sản phẩm
                {result.totalPages > 1 ? ` · Trang ${result.page}/${result.totalPages}` : ""}
              </p>
              <SortSelect query={query} />
            </div>

            {result.items.length === 0 ? (
              <EmptyState
                title="Không tìm thấy sản phẩm"
                description="Thử bỏ bớt bộ lọc hoặc xem toàn bộ sản phẩm."
                action={
                  <ButtonLink href="/shop" variant="secondary">
                    Xem tất cả
                  </ButtonLink>
                }
              />
            ) : (
              <>
                <Reveal>
                  <ProductGrid products={result.items} />
                </Reveal>
                <Pagination
                  page={result.page}
                  totalPages={result.totalPages}
                  makeHref={(p) => buildShopHref(query, { page: p })}
                />
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
