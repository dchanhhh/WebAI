"use server";

import { checkoutSchema } from "@/lib/validators";
import { createOrder } from "@/lib/orders";

export type PlaceOrderResult =
  | { ok: true; code: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function placeOrder(raw: unknown): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      ok: false,
      error: "Vui lòng kiểm tra lại thông tin.",
      fieldErrors,
    };
  }

  const result = await createOrder(parsed.data);
  if (!result.ok) return { ok: false, error: result.error };
  return { ok: true, code: result.code };
}
