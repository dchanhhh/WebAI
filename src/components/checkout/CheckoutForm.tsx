"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Fieldset, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { buttonClasses } from "@/components/ui/Button";
import { useCart, selectSubtotal, lineKey } from "@/lib/cart-store";
import { calcShippingFee } from "@/lib/shipping";
import { formatVnd } from "@/lib/money";
import { placeOrder } from "@/actions/checkout";
import { PAYMENT_METHOD } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCart();
  const subtotal = useCart(selectSubtotal);
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState<"cod" | "bank_transfer">("cod");

  if (items.length === 0) {
    return (
      <EmptyState
        title="Giỏ hàng đang trống"
        description="Thêm sản phẩm trước khi đặt hàng."
        action={
          <Link href="/shop" className={buttonClasses({ variant: "primary" })}>
            Mua sắm ngay
          </Link>
        }
      />
    );
  }

  const shipping = calcShippingFee(subtotal);
  const total = subtotal + shipping;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      customerName: String(fd.get("customerName") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      address: String(fd.get("address") ?? ""),
      note: String(fd.get("note") ?? ""),
      paymentMethod: payment,
      items: items.map((l) => ({
        productId: l.productId,
        slug: l.slug,
        name: l.name,
        priceVnd: l.priceVnd,
        imageUrl: l.imageUrl,
        size: l.size,
        color: l.color,
        qty: l.qty,
      })),
    };

    startTransition(async () => {
      const res = await placeOrder(payload);
      if (res.ok) {
        clear();
        router.push(`/dat-hang-thanh-cong/${res.code}`);
      } else {
        setFormError(res.error);
        setFieldErrors(res.fieldErrors ?? {});
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <h2 className="text-h4 text-ink">Thông tin nhận hàng</h2>

        <Fieldset label="Họ và tên" htmlFor="customerName" required error={fieldErrors.customerName}>
          <Input id="customerName" name="customerName" autoComplete="name" required
            aria-invalid={!!fieldErrors.customerName} />
        </Fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <Fieldset label="Số điện thoại" htmlFor="phone" required error={fieldErrors.phone}>
            <Input id="phone" name="phone" inputMode="tel" autoComplete="tel" required
              placeholder="0xxxxxxxxx" aria-invalid={!!fieldErrors.phone} />
          </Fieldset>
          <Fieldset label="Email (không bắt buộc)" htmlFor="email" error={fieldErrors.email}>
            <Input id="email" name="email" type="email" autoComplete="email"
              aria-invalid={!!fieldErrors.email} />
          </Fieldset>
        </div>

        <Fieldset label="Địa chỉ nhận hàng" htmlFor="address" required error={fieldErrors.address}
          hint="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành.">
          <Textarea id="address" name="address" autoComplete="street-address" required
            aria-invalid={!!fieldErrors.address} />
        </Fieldset>

        <Fieldset label="Ghi chú (không bắt buộc)" htmlFor="note">
          <Textarea id="note" name="note" placeholder="Thời gian giao, ghi chú cho shipper…" />
        </Fieldset>

        <fieldset className="pt-2">
          <legend className="mb-2 text-overline text-ink">Phương thức thanh toán</legend>
          <div className="space-y-2">
            {(Object.keys(PAYMENT_METHOD) as (keyof typeof PAYMENT_METHOD)[]).map((m) => (
              <label
                key={m}
                className={cn(
                  "flex cursor-pointer items-start gap-3 border p-4 text-sm transition-colors",
                  payment === m ? "border-ink bg-surface" : "border-line hover:border-ink",
                )}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={m}
                  checked={payment === m}
                  onChange={() => setPayment(m)}
                  className="mt-0.5 accent-[color:var(--color-accent)]"
                />
                <span>
                  <span className="block font-medium text-ink">{PAYMENT_METHOD[m]}</span>
                  <span className="block text-muted">
                    {m === "cod"
                      ? "Trả tiền mặt khi nhận hàng."
                      : "Chuyển khoản trước, chúng tôi xác nhận rồi giao hàng."}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {formError ? (
          <p className="rounded-sm border border-error/40 bg-error/5 px-4 py-3 text-sm text-error">
            {formError}
          </p>
        ) : null}
      </div>

      <aside className="h-fit border border-line p-6 lg:sticky lg:top-28">
        <h2 className="text-h4 text-ink">Đơn hàng ({items.length})</h2>
        <ul className="mt-4 divide-y divide-line">
          {items.map((l) => (
            <li key={lineKey(l)} className="flex gap-3 py-3">
              <div className="relative h-16 w-12 flex-none bg-surface-2">
                {l.imageUrl ? (
                  <Image src={l.imageUrl} alt={l.name} fill sizes="48px" className="object-cover" />
                ) : null}
              </div>
              <div className="flex-1 text-sm">
                <p className="line-clamp-1 font-medium text-ink">{l.name}</p>
                <p className="text-muted">
                  {[l.color, l.size && `Size ${l.size}`].filter(Boolean).join(" · ")}
                  {l.size || l.color ? " · " : ""}SL {l.qty}
                </p>
              </div>
              <span className="text-sm">{formatVnd(l.priceVnd * l.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Tạm tính</dt>
            <dd>{formatVnd(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Phí vận chuyển</dt>
            <dd>{shipping === 0 ? "Miễn phí" : formatVnd(shipping)}</dd>
          </div>
        </dl>
        <div className="mt-3 flex justify-between border-t border-line pt-3">
          <span className="text-h4 text-ink">Tổng cộng</span>
          <span className="text-h4 text-ink">{formatVnd(total)}</span>
        </div>
        <Button type="submit" variant="primary" size="lg" className="mt-6 w-full" disabled={pending}>
          {pending ? "Đang xử lý…" : "Xác nhận đặt hàng"}
        </Button>
        <p className="mt-3 text-center text-sm text-muted">
          Bằng việc đặt hàng, bạn đồng ý với điều khoản của Luméa.
        </p>
      </aside>
    </form>
  );
}
