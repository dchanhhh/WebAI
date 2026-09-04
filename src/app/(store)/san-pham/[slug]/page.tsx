import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGallery } from "@/components/product/ProductGallery";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { ProductGrid } from "@/components/product/ProductGrid";
import { IconTruck, IconReturn } from "@/components/ui/icons";
import { prisma } from "@/lib/prisma";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { discountPercent } from "@/lib/money";

export async function generateStaticParams() {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return {};
  const price = p.salePriceVnd ?? p.priceVnd;
  return {
    title: p.name,
    description: p.description.slice(0, 160),
    openGraph: {
      title: p.name,
      description: p.description.slice(0, 160),
      images: p.images[0] ? [p.images[0].url] : undefined,
      type: "website",
    },
    other: { "product:price:amount": String(price), "product:price:currency": "VND" },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId, 4);
  const off = product.salePriceVnd
    ? discountPercent(product.priceVnd, product.salePriceVnd)
    : 0;

  return (
    <>
      <Container className="py-8 lg:py-12">
        <Breadcrumb
          items={[
            { label: "Sản phẩm", href: "/shop" },
            { label: product.category.name, href: `/danh-muc/${product.category.slug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <p className="text-overline text-muted">{product.category.name}</p>
            <h1 className="mt-2 text-h2 text-ink">{product.name}</h1>

            <div className="mt-4 flex items-center gap-3">
              <Price priceVnd={product.priceVnd} salePriceVnd={product.salePriceVnd} size="lg" />
              {off > 0 ? <Badge tone="sale">-{off}%</Badge> : null}
            </div>

            <p className="mt-6 max-w-prose text-ink-soft">{product.description}</p>

            <div className="mt-8 border-t border-line pt-8">
              <AddToCartForm
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  priceVnd: product.priceVnd,
                  salePriceVnd: product.salePriceVnd,
                  stock: product.stock,
                  imageUrl: product.images[0]?.url,
                  sizes: product.sizeList,
                  colors: product.colorList,
                  variants: product.variants.map((v) => ({
                    size: v.size,
                    color: v.color,
                    stock: v.stock,
                  })),
                }}
              />
            </div>

            <ul className="mt-8 space-y-2 border-t border-line pt-6 text-sm text-muted">
              <li className="flex items-center gap-2">
                <IconTruck width={18} height={18} className="text-accent" />
                Miễn phí giao hàng cho đơn từ 500.000 ₫
              </li>
              <li className="flex items-center gap-2">
                <IconReturn width={18} height={18} className="text-accent" />
                Đổi trả trong 30 ngày
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {related.length > 0 ? (
        <section className="bg-surface py-16 lg:py-24">
          <Container>
            <SectionHeading eyebrow="Gợi ý" title="Sản phẩm liên quan" />
            <ProductGrid products={related} />
            <div className="mt-10 text-center">
              <Link
                href={`/danh-muc/${product.category.slug}`}
                className="text-overline text-ink hover:text-accent"
              >
                Xem tất cả {product.category.name}
              </Link>
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
