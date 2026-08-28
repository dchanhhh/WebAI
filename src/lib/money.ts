// Tiền tệ: số nguyên VND (đồng). Không dùng số thực.

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

/** 149500 -> "149.500 ₫" */
export function formatVnd(amount: number): string {
  return vndFormatter.format(Math.round(amount));
}

/** 149500 -> "149.500" (không kèm ký hiệu tiền) */
export function formatVndPlain(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(amount));
}

/** "149.500 ₫" / "149500" / "149,500" -> 149500 (đồng). NaN nếu không hợp lệ. */
export function parseVndInput(input: string): number {
  const digits = input.replace(/[^\d]/g, "");
  return digits ? Number.parseInt(digits, 10) : Number.NaN;
}

/** Phần trăm giảm giá làm tròn, vd 149500 -> 89990 => "-40%" */
export function discountPercent(priceVnd: number, salePriceVnd: number): number {
  if (!salePriceVnd || salePriceVnd >= priceVnd) return 0;
  return Math.round((1 - salePriceVnd / priceVnd) * 100);
}
