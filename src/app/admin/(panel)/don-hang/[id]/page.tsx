import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatVnd } from "@/lib/money";
import { formatDateVi } from "@/lib/utils";
import { PAYMENT_METHOD } from "@/lib/constants";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { BANK_INFO } from "@/lib/constants";

export const metadata: Metadata = { title: "Chi tiết đơn" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin/don-hang" className="text-sm text-muted hover:text-accent">
            ← Đơn hàng
          </Link>
          <h1 className="mt-1 text-h2 text-ink">{order.code}</h1>
          <p className="text-sm text-muted">Đặt lúc {formatDateVi(order.createdAt)}</p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="border border-line">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-surface text-left text-muted">
              <tr>
                <th className="px-4 py-2.5 font-medium">Sản phẩm</th>
                <th className="px-4 py-2.5 font-medium">Đơn giá</th>
                <th className="px-4 py-2.5 font-medium">SL</th>
                <th className="px-4 py-2.5 font-medium">Thành tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {order.items.map((it) => (
                <tr key={it.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-11 flex-none bg-surface-2">
                        {it.imageUrl ? (
                          <Image src={it.imageUrl} alt="" fill sizes="44px" className="object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <Link
                          href={`/san-pham/${it.productSlug}`}
                          className="font-medium text-ink hover:text-accent"
                        >
                          {it.productName}
                        </Link>
                        {(it.size || it.color) && (
                          <p className="text-muted">
                            {[it.color, it.size && `Size ${it.size}`].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatVnd(it.unitPriceVnd)}</td>
                  <td className="px-4 py-3">{it.quantity}</td>
                  <td className="px-4 py-3">{formatVnd(it.unitPriceVnd * it.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-line">
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right text-muted">
                  Tạm tính
                </td>
                <td className="px-4 py-2">{formatVnd(order.subtotalVnd)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right text-muted">
                  Phí vận chuyển
                </td>
                <td className="px-4 py-2">
                  {order.shippingFeeVnd === 0 ? "Miễn phí" : formatVnd(order.shippingFeeVnd)}
                </td>
              </tr>
              <tr className="border-t border-line">
                <td colSpan={3} className="px-4 py-2.5 text-right font-medium text-ink">
                  Tổng cộng
                </td>
                <td className="px-4 py-2.5 font-medium text-ink">{formatVnd(order.totalVnd)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <aside className="space-y-4">
          <div className="border border-line p-4 text-sm">
            <p className="text-overline text-ink">Khách hàng</p>
            <p className="mt-2 font-medium text-ink">{order.customerName}</p>
            <p className="text-ink-soft">{order.phone}</p>
            {order.email ? <p className="text-ink-soft">{order.email}</p> : null}
            <p className="mt-2 text-ink-soft">{order.address}</p>
            {order.note ? (
              <p className="mt-2 text-muted">
                <span className="text-ink-soft">Ghi chú:</span> {order.note}
              </p>
            ) : null}
          </div>

          <div className="border border-line p-4 text-sm">
            <p className="text-overline text-ink">Thanh toán</p>
            <p className="mt-2 text-ink-soft">
              {PAYMENT_METHOD[order.paymentMethod as keyof typeof PAYMENT_METHOD] ??
                order.paymentMethod}
            </p>
            {order.paymentMethod === "bank_transfer" ? (
              <div className="mt-2 space-y-0.5 text-muted">
                <p>{BANK_INFO.bankName}</p>
                <p>
                  {BANK_INFO.accountNumber} — {BANK_INFO.accountName}
                </p>
                <p>
                  Nội dung: <span className="font-medium text-ink">{order.code}</span>
                </p>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
