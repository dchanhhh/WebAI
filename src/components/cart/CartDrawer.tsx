"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart, selectSubtotal, lineKey } from "@/lib/cart-store";
import { formatVnd } from "@/lib/money";
import { buttonClasses } from "@/components/ui/Button";
import { IconClose, IconMinus, IconPlus } from "@/components/ui/icons";
import { FREE_SHIPPING_THRESHOLD_VND } from "@/lib/constants";

export function CartDrawer() {
  const { items, isOpen, close, setQty, remove } = useCart();
  const subtotal = useCart(selectSubtotal);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  const remain = FREE_SHIPPING_THRESHOLD_VND - subtotal;

  return (
    <div
      className={cnRoot(isOpen)}
      aria-hidden={!isOpen}
      role="dialog"
      aria-label="Giỏ hàng"
      aria-modal={isOpen}
    >
      <button
        type="button"
        aria-label="Đóng giỏ hàng"
        tabIndex={isOpen ? 0 : -1}
        onClick={close}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-bg shadow-xl transition-transform duration-[240ms] ease-standard ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-h4 text-ink">Giỏ hàng ({items.length})</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Đóng"
            className="grid h-11 w-11 place-items-center text-ink hover:text-accent"
          >
            <IconClose />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted">Giỏ hàng của bạn đang trống.</p>
            <Link
              href="/shop"
              onClick={close}
              className={buttonClasses({ variant: "secondary", size: "md" })}
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map((l) => {
                const key = lineKey(l);
                return (
                  <li key={key} className="flex gap-3 py-4">
                    <div className="relative h-24 w-[72px] flex-none bg-surface-2">
                      {l.imageUrl ? (
                        <Image src={l.imageUrl} alt={l.name} fill sizes="72px" className="object-cover" />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/san-pham/${l.slug}`}
                        onClick={close}
                        className="line-clamp-2 text-sm font-medium text-ink hover:text-accent"
                      >
                        {l.name}
                      </Link>
                      {(l.size || l.color) && (
                        <p className="mt-0.5 text-sm text-muted">
                          {[l.color, l.size && `Size ${l.size}`].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="inline-flex items-center border border-line">
                          <button
                            type="button"
                            aria-label="Giảm"
                            className="grid h-8 w-8 place-items-center text-ink hover:bg-surface"
                            onClick={() => setQty(key, l.qty - 1)}
                          >
                            <IconMinus width={14} height={14} />
                          </button>
                          <span className="w-8 text-center text-sm">{l.qty}</span>
                          <button
                            type="button"
                            aria-label="Tăng"
                            className="grid h-8 w-8 place-items-center text-ink hover:bg-surface"
                            onClick={() => setQty(key, l.qty + 1)}
                          >
                            <IconPlus width={14} height={14} />
                          </button>
                        </div>
                        <span className="text-sm font-medium">{formatVnd(l.priceVnd * l.qty)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(key)}
                      aria-label="Xoá sản phẩm"
                      className="self-start text-muted hover:text-error"
                    >
                      <IconClose width={16} height={16} />
                    </button>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-line px-5 py-4">
              {FREE_SHIPPING_THRESHOLD_VND > 0 && remain > 0 ? (
                <p className="mb-3 text-sm text-muted">
                  Mua thêm <span className="font-medium text-ink">{formatVnd(remain)}</span> để được
                  miễn phí vận chuyển.
                </p>
              ) : null}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-muted">Tạm tính</span>
                <span className="text-lg font-medium">{formatVnd(subtotal)}</span>
              </div>
              <div className="grid gap-2">
                <Link
                  href="/thanh-toan"
                  onClick={close}
                  className={buttonClasses({ variant: "primary", size: "md", className: "w-full" })}
                >
                  Tiến hành đặt hàng
                </Link>
                <Link
                  href="/gio-hang"
                  onClick={close}
                  className={buttonClasses({ variant: "ghost", size: "md", className: "w-full justify-center" })}
                >
                  Xem giỏ hàng
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

function cnRoot(open: boolean) {
  return `fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`;
}
