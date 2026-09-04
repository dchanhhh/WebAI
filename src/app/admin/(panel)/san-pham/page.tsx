import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/money";
import { buttonClasses } from "@/components/ui/Button";
import { deleteProductAction } from "@/actions/admin";

export const metadata: Metadata = { title: "Sản phẩm" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saved?: string }>;
}) {
  const { q, saved } = await searchParams;
  const products = await prisma.product.findMany({
    where: q ? { name: { contains: q } } : undefined,
    orderBy: { updatedAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      variants: { select: { stock: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h2 text-ink">Sản phẩm</h1>
        <Link href="/admin/san-pham/moi" className={buttonClasses({ variant: "primary", size: "md" })}>
          + Thêm sản phẩm
        </Link>
      </div>

      {saved ? (
        <p className="rounded-sm border border-success/40 bg-success/5 px-4 py-2.5 text-sm text-success">
          Đã lưu sản phẩm.
        </p>
      ) : null}

      <form method="get" className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo tên…"
          className="h-10 w-full max-w-xs rounded-sm border border-line px-3 text-sm focus-visible:border-ink focus-visible:outline-none"
        />
        <button className={buttonClasses({ variant: "secondary", size: "sm" })}>Tìm</button>
      </form>

      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="border-b border-line bg-surface text-left text-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Sản phẩm</th>
              <th className="px-4 py-2.5 font-medium">Danh mục</th>
              <th className="px-4 py-2.5 font-medium">Giá</th>
              <th className="px-4 py-2.5 font-medium">Tồn</th>
              <th className="px-4 py-2.5 font-medium">Trạng thái</th>
              <th className="px-4 py-2.5 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {products.map((p) => {
              const stock = p.variants.reduce((s, v) => s + v.stock, 0);
              return (
              <tr key={p.id} className="hover:bg-surface">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-11 flex-none bg-surface-2">
                      {p.images[0] ? (
                        <Image src={p.images[0].url} alt="" fill sizes="44px" className="object-cover" />
                      ) : null}
                    </div>
                    <Link href={`/admin/san-pham/${p.id}`} className="font-medium text-ink hover:text-accent">
                      {p.name}
                    </Link>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.category.name}</td>
                <td className="px-4 py-3">
                  {p.salePriceVnd ? (
                    <span>
                      <span className="text-sale">{formatVnd(p.salePriceVnd)}</span>{" "}
                      <span className="text-muted line-through">{formatVnd(p.priceVnd)}</span>
                    </span>
                  ) : (
                    formatVnd(p.priceVnd)
                  )}
                </td>
                <td className={`px-4 py-3 ${stock <= 5 ? "text-sale" : ""}`}>{stock}</td>
                <td className="px-4 py-3">
                  {p.isActive ? (
                    <span className="text-success">Đang bán</span>
                  ) : (
                    <span className="text-muted">Đã ẩn</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/san-pham/${p.id}`} className="text-ink hover:text-accent">
                      Sửa
                    </Link>
                    {p.isActive ? (
                      <form action={deleteProductAction}>
                        <input type="hidden" name="id" value={p.id} />
                        <button className="text-error hover:underline">Ẩn</button>
                      </form>
                    ) : null}
                  </div>
                </td>
              </tr>
              );
            })}
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  Không có sản phẩm.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
