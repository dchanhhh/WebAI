import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Thêm sản phẩm" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/san-pham" className="text-sm text-muted hover:text-accent">
          ← Sản phẩm
        </Link>
        <h1 className="mt-1 text-h2 text-ink">Thêm sản phẩm</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
