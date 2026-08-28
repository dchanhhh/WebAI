import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/money";
import { formatDateVi } from "@/lib/utils";
import {
  ORDER_STATUS,
  ORDER_STATUS_KEYS,
  PAYMENT_METHOD,
  type OrderStatus,
} from "@/lib/constants";
import { OrderStatusBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Đơn hàng" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = ORDER_STATUS_KEYS.includes(status as OrderStatus)
    ? (status as OrderStatus)
    : undefined;

  const orders = await prisma.order.findMany({
    where: activeStatus ? { status: activeStatus } : undefined,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-h2 text-ink">Đơn hàng</h1>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href="/admin/don-hang"
          className={cn(
            "rounded-sm border px-3 py-1.5",
            !activeStatus ? "border-ink bg-ink text-bg" : "border-line text-ink-soft hover:border-ink",
          )}
        >
          Tất cả
        </Link>
        {ORDER_STATUS_KEYS.map((s) => (
          <Link
            key={s}
            href={`/admin/don-hang?status=${s}`}
            className={cn(
              "rounded-sm border px-3 py-1.5",
              activeStatus === s ? "border-ink bg-ink text-bg" : "border-line text-ink-soft hover:border-ink",
            )}
          >
            {ORDER_STATUS[s]}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto border border-line">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line bg-surface text-left text-muted">
            <tr>
              <th className="px-4 py-2.5 font-medium">Mã</th>
              <th className="px-4 py-2.5 font-medium">Khách hàng</th>
              <th className="px-4 py-2.5 font-medium">SL</th>
              <th className="px-4 py-2.5 font-medium">Tổng</th>
              <th className="px-4 py-2.5 font-medium">Thanh toán</th>
              <th className="px-4 py-2.5 font-medium">Trạng thái</th>
              <th className="px-4 py-2.5 font-medium">Ngày</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((o) => {
              const st = (o.status as OrderStatus) in ORDER_STATUS ? (o.status as OrderStatus) : "pending";
              return (
                <tr key={o.id} className="hover:bg-surface">
                  <td className="px-4 py-3">
                    <Link href={`/admin/don-hang/${o.id}`} className="font-medium text-ink hover:text-accent">
                      {o.code}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">
                    {o.customerName}
                    <span className="block text-muted">{o.phone}</span>
                  </td>
                  <td className="px-4 py-3">{o._count.items}</td>
                  <td className="px-4 py-3">{formatVnd(o.totalVnd)}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {PAYMENT_METHOD[o.paymentMethod as keyof typeof PAYMENT_METHOD] ?? o.paymentMethod}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={st} label={ORDER_STATUS[st]} />
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDateVi(o.createdAt)}</td>
                </tr>
              );
            })}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  Không có đơn hàng.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
