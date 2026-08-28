import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/layout/PageHeader";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Reveal } from "@/components/ui/Reveal";
import { ShopFilters } from "@/components/product/ShopFilters";
import { SortSelect } from "@/components/product/SortSelect";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { listProducts, getAllCategories, getCategoryBySlug } from "@/lib/products";
import { prisma } from "@/lib/prisma";
import {
  parseShopQuery,
  priceBounds,
  buildShopHref,
  type RawSearchParams,
} from "@/lib/shop-query";

export async function generateStaticParams() {
  const cats = await prisma.category.findMany({ select: { slug: true } });
  return cats.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return {};
  return {
    title: cat.name,
    description: cat.description ?? `Bộ sưu tập ${cat.name} của Nhà May.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { slug } = await params;
  const [category, sp] = await Promise.all([getCategoryBySlug(slug), searchParams]);
  if (!category) notFound();

  const basePath = `/danh-muc/${slug}`;
  const query = parseShopQuery({ ...sp, category: undefined });
  const { priceMin, priceMax } = priceBounds(query.price);

  const [categories, result] = await Promise.all([
    getAllCategories(),
    listProducts({
      categorySlug: slug,
      sort: query.sort,
      priceMin,
      priceMax,
      onSale: query.onSale,
      isNew: query.isNew,
      page: query.page,
    }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Danh mục"
        title={category.name}
        description={category.description ?? undefined}
        breadcrumb={[{ label: "Sản phẩm", href: "/shop" }, { label: category.name }]}
      />

      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <ShopFilters categories={categories} query={query} basePath={basePath} />
          <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">
                {result.total} sản phẩm
                {result.totalPages > 1 ? ` · Trang ${result.page}/${result.totalPages}` : ""}
              </p>
              <SortSelect query={query} basePath={basePath} />
            </div>

            {result.items.length === 0 ? (
              <EmptyState
                title="Chưa có sản phẩm phù hợp"
                description="Thử bỏ bớt bộ lọc."
                action={
                  <ButtonLink href={basePath} variant="secondary">
                    Bỏ bộ lọc
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
                  makeHref={(p) => buildShopHref(query, { page: p }, basePath)}
                />
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
