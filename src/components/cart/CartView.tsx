"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, selectSubtotal, lineKey } from "@/lib/cart-store";
import { formatVnd } from "@/lib/money";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { IconMinus, IconPlus, IconClose } from "@/components/ui/icons";
import { calcShippingFee } from "@/lib/shipping";
import { FREE_SHIPPING_THRESHOLD_VND } from "@/lib/constants";

export function CartView() {
  const { items, setQty, remove } = useCart();
  const subtotal = useCart(selectSubtotal);

  if (items.length === 0) {
    return (
      <EmptyState
        title="Giỏ hàng đang trống"
        description="Khám phá bộ sưu tập và thêm sản phẩm bạn yêu thích."
        action={
          <Link href="/shop" className={buttonClasses({ variant: "primary" })}>
            Bắt đầu mua sắm
          </Link>
        }
      />
    );
  }

  const shipping = calcShippingFee(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {items.map((l) => {
            const key = lineKey(l);
            return (
              <li key={key} className="flex gap-4 py-5">
                <Link
                  href={`/san-pham/${l.slug}`}
                  className="relative h-32 w-24 flex-none bg-surface-2"
                >
                  {l.imageUrl ? (
                    <Image src={l.imageUrl} alt={l.name} fill sizes="96px" className="object-cover" />
                  ) : null}
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/san-pham/${l.slug}`}
                        className="text-h4 text-ink hover:text-accent"
                      >
                        {l.name}
                      </Link>
                      {(l.size || l.color) && (
                        <p className="mt-1 text-sm text-muted">
                          {[l.color, l.size && `Size ${l.size}`].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(key)}
                      aria-label="Xoá"
                      className="grid h-9 w-9 place-items-center text-muted hover:text-error"
                    >
                      <IconClose width={16} height={16} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center border border-line">
                      <button
                        type="button"
                        aria-label="Giảm"
                        className="grid h-9 w-9 place-items-center hover:bg-surface"
                        onClick={() => setQty(key, l.qty - 1)}
                      >
                        <IconMinus width={14} height={14} />
                      </button>
                      <span className="w-10 text-center text-sm">{l.qty}</span>
                      <button
                        type="button"
                        aria-label="Tăng"
                        className="grid h-9 w-9 place-items-center hover:bg-surface"
                        onClick={() => setQty(key, l.qty + 1)}
                      >
                        <IconPlus width={14} height={14} />
                      </button>
                    </div>
                    <span className="font-medium">{formatVnd(l.priceVnd * l.qty)}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-5">
          <Link href="/shop" className="text-sm text-ink underline-offset-4 hover:underline">
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>

      <aside className="h-fit border border-line p-6 lg:sticky lg:top-28">
        <h2 className="text-h4 text-ink">Tóm tắt đơn hàng</h2>
        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Tạm tính</dt>
            <dd>{formatVnd(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Phí vận chuyển</dt>
            <dd>{shipping === 0 ? "Miễn phí" : formatVnd(shipping)}</dd>
          </div>
          {FREE_SHIPPING_THRESHOLD_VND > 0 && subtotal < FREE_SHIPPING_THRESHOLD_VND ? (
            <p className="text-sm text-muted">
              Mua thêm {formatVnd(FREE_SHIPPING_THRESHOLD_VND - subtotal)} để miễn phí vận chuyển.
            </p>
          ) : null}
        </dl>
        <div className="mt-4 flex justify-between border-t border-line pt-4">
          <span className="text-h4 text-ink">Tổng cộng</span>
          <span className="text-h4 text-ink">{formatVnd(total)}</span>
        </div>
        <Link
          href="/thanh-toan"
          className={buttonClasses({ variant: "primary", size: "lg", className: "mt-6 w-full" })}
        >
          Đặt hàng
        </Link>
        <p className="mt-3 text-center text-sm text-muted">
          Thanh toán COD hoặc chuyển khoản. Không cần tài khoản.
        </p>
      </aside>
    </div>
  );
}
