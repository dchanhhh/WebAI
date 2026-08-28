import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { deleteCategoryAction } from "@/actions/admin";

export const metadata: Metadata = { title: "Danh mục" };

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  const editing = edit ? categories.find((c) => c.id === edit) ?? null : null;

  return (
    <div className="space-y-6">
      <h1 className="text-h2 text-ink">Danh mục</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="overflow-x-auto border border-line">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="border-b border-line bg-surface text-left text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">Tên</th>
                <th className="px-4 py-2.5 font-medium">Slug</th>
                <th className="px-4 py-2.5 font-medium">Sản phẩm</th>
                <th className="px-4 py-2.5 font-medium">Thứ tự</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-surface">
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-muted">{c.slug}</td>
                  <td className="px-4 py-3">{c._count.products}</td>
                  <td className="px-4 py-3">{c.sortOrder}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/danh-muc?edit=${c.id}`} className="text-ink hover:text-accent">
                        Sửa
                      </Link>
                      {c._count.products === 0 ? (
                        <form action={deleteCategoryAction}>
                          <input type="hidden" name="id" value={c.id} />
                          <button className="text-error hover:underline">Xoá</button>
                        </form>
                      ) : (
                        <span className="text-muted" title="Còn sản phẩm">
                          Xoá
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CategoryForm
          editing={
            editing
              ? {
                  id: editing.id,
                  name: editing.name,
                  slug: editing.slug,
                  description: editing.description,
                  imageUrl: editing.imageUrl,
                  sortOrder: editing.sortOrder,
                }
              : null
          }
        />
      </div>
    </div>
  );
}
