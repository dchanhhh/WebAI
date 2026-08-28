import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/money";
import { formatDateVi } from "@/lib/utils";
import { ORDER_STATUS, ORDER_STATUS_KEYS, type OrderStatus } from "@/lib/constants";
import { OrderStatusBadge } from "@/components/ui/Badge";

export const metadata: Metadata = { title: "Tổng quan" };

export default async function AdminDashboard() {
  const [statusCounts, revenueAgg, productCount, lowStock, recentOrders] = await Promise.all([
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.order.aggregate({ _sum: { totalVnd: true }, where: { status: { not: "cancelled" } } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.findMany({
      where: { isActive: true, stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 6,
      select: { id: true, name: true, stock: true, slug: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, code: true, customerName: true, totalVnd: true, status: true, createdAt: true },
    }),
  ]);

  const countByStatus = (s: string) =>
    statusCounts.find((c) => c.status === s)?._count._all ?? 0;

  const cards = [
    { label: "Doanh thu (trừ đơn huỷ)", value: formatVnd(revenueAgg._sum.totalVnd ?? 0) },
    { label: "Đơn chờ xử lý", value: countByStatus("pending") },
    { label: "Đơn đang giao", value: countByStatus("shipping") },
    { label: "Sản phẩm đang bán", value: productCount },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-h2 text-ink">Tổng quan</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-line p-5">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 text-h3 text-ink">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-h4 text-ink">Đơn hàng gần đây</h2>
            <Link href="/admin/don-hang" className="text-sm text-ink hover:text-accent">
              Xem tất cả
            </Link>
          </div>
          <div className="mt-3 overflow-x-auto border border-line">
            <table className="w-full min-w-[520px] text-sm">
              <thead className="border-b border-line bg-surface text-left text-muted">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Mã</th>
                  <th className="px-4 py-2.5 font-medium">Khách</th>
                  <th className="px-4 py-2.5 font-medium">Tổng</th>
                  <th className="px-4 py-2.5 font-medium">Trạng thái</th>
                  <th className="px-4 py-2.5 font-medium">Ngày</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recentOrders.map((o) => {
                  const st = (o.status as OrderStatus) in ORDER_STATUS ? (o.status as OrderStatus) : "pending";
                  return (
                    <tr key={o.id} className="hover:bg-surface">
                      <td className="px-4 py-2.5">
                        <Link href={`/admin/don-hang/${o.id}`} className="font-medium text-ink hover:text-accent">
                          {o.code}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-ink-soft">{o.customerName}</td>
                      <td className="px-4 py-2.5">{formatVnd(o.totalVnd)}</td>
                      <td className="px-4 py-2.5">
                        <OrderStatusBadge status={st} label={ORDER_STATUS[st]} />
                      </td>
                      <td className="px-4 py-2.5 text-muted">{formatDateVi(o.createdAt)}</td>
                    </tr>
                  );
                })}
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted">
                      Chưa có đơn hàng nào.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-h4 text-ink">Sắp hết hàng</h2>
          <ul className="mt-3 divide-y divide-line border border-line">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <Link href={`/admin/san-pham/${p.id}`} className="text-ink hover:text-accent">
                  {p.name}
                </Link>
                <span className={p.stock === 0 ? "text-error" : "text-sale"}>Còn {p.stock}</span>
              </li>
            ))}
            {lowStock.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-muted">Tồn kho ổn định.</li>
            ) : null}
          </ul>
          <div className="mt-4 border border-line p-4 text-sm">
            <p className="text-muted">Phân bố đơn theo trạng thái</p>
            <ul className="mt-2 space-y-1">
              {ORDER_STATUS_KEYS.map((s) => (
                <li key={s} className="flex justify-between">
                  <span className="text-ink-soft">{ORDER_STATUS[s]}</span>
                  <span className="font-medium">{countByStatus(s)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
