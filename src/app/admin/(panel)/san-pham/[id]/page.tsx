import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { parseStringArray } from "@/lib/utils";

export const metadata: Metadata = { title: "Sửa sản phẩm" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/san-pham" className="text-sm text-muted hover:text-accent">
          ← Sản phẩm
        </Link>
        <h1 className="mt-1 text-h2 text-ink">{product.name}</h1>
      </div>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          categoryId: product.categoryId,
          priceVnd: product.priceVnd,
          salePriceVnd: product.salePriceVnd,
          stock: product.stock,
          sizes: parseStringArray(product.sizes),
          colors: parseStringArray(product.colors),
          images: product.images.map((i) => i.url),
          isActive: product.isActive,
          isNew: product.isNew,
          isFeatured: product.isFeatured,
        }}
      />
    </div>
  );
}
