import Image from "next/image";
import { formatVnd } from "@/lib/money";
import { ORDER_STATUS, PAYMENT_METHOD, type OrderStatus } from "@/lib/constants";
import { OrderStatusBadge } from "@/components/ui/Badge";

type OrderItem = {
  id: string;
  productName: string;
  productSlug: string;
  imageUrl: string | null;
  unitPriceVnd: number;
  quantity: number;
  size: string | null;
  color: string | null;
};

type Order = {
  code: string;
  status: string;
  paymentMethod: string;
  customerName: string;
  phone: string;
  address: string;
  note: string | null;
  subtotalVnd: number;
  shippingFeeVnd: number;
  totalVnd: number;
  createdAt: Date;
  items: OrderItem[];
};

export function OrderSummaryCard({ order }: { order: Order }) {
  const status = (order.status as OrderStatus) in ORDER_STATUS
    ? (order.status as OrderStatus)
    : "pending";

  return (
    <div className="border border-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface px-5 py-4">
        <div>
          <p className="text-overline text-muted">Mã đơn hàng</p>
          <p className="text-h4 text-ink">{order.code}</p>
        </div>
        <OrderStatusBadge status={status} label={ORDER_STATUS[status]} />
      </div>

      <ul className="divide-y divide-line px-5">
        {order.items.map((it) => (
          <li key={it.id} className="flex gap-3 py-4">
            <div className="relative h-20 w-16 flex-none bg-surface-2">
              {it.imageUrl ? (
                <Image src={it.imageUrl} alt={it.productName} fill sizes="64px" className="object-cover" />
              ) : null}
            </div>
            <div className="flex-1 text-sm">
              <p className="font-medium text-ink">{it.productName}</p>
              <p className="text-muted">
                {[it.color, it.size && `Size ${it.size}`].filter(Boolean).join(" · ")}
                {it.size || it.color ? " · " : ""}SL {it.quantity}
              </p>
            </div>
            <span className="text-sm">{formatVnd(it.unitPriceVnd * it.quantity)}</span>
          </li>
        ))}
      </ul>

      <dl className="space-y-2 border-t border-line px-5 py-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Tạm tính</dt>
          <dd>{formatVnd(order.subtotalVnd)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Phí vận chuyển</dt>
          <dd>{order.shippingFeeVnd === 0 ? "Miễn phí" : formatVnd(order.shippingFeeVnd)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-2 text-base">
          <dt className="font-medium text-ink">Tổng cộng</dt>
          <dd className="font-medium text-ink">{formatVnd(order.totalVnd)}</dd>
        </div>
      </dl>

      <div className="grid gap-1 border-t border-line px-5 py-4 text-sm text-muted">
        <p>
          <span className="text-ink-soft">Người nhận:</span> {order.customerName} · {order.phone}
        </p>
        <p>
          <span className="text-ink-soft">Địa chỉ:</span> {order.address}
        </p>
        <p>
          <span className="text-ink-soft">Thanh toán:</span>{" "}
          {PAYMENT_METHOD[order.paymentMethod as keyof typeof PAYMENT_METHOD] ?? order.paymentMethod}
        </p>
        {order.note ? (
          <p>
            <span className="text-ink-soft">Ghi chú:</span> {order.note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
