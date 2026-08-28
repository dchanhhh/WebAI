"use client";

import { useRef, useTransition } from "react";
import { updateOrderStatusAction } from "@/actions/admin";
import { ORDER_STATUS, ORDER_STATUS_KEYS } from "@/lib/constants";

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateOrderStatusAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={orderId} />
      <select
        name="status"
        defaultValue={status}
        disabled={pending}
        onChange={() => startTransition(() => formRef.current?.requestSubmit())}
        className="h-10 rounded-sm border border-line px-3 text-sm focus-visible:border-ink focus-visible:outline-none"
        aria-label="Đổi trạng thái đơn"
      >
        {ORDER_STATUS_KEYS.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS[s]}
          </option>
        ))}
      </select>
      {pending ? <span className="text-sm text-muted">Đang lưu…</span> : null}
    </form>
  );
}
