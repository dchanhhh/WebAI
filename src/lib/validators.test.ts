import { describe, it, expect } from "vitest";
import { checkoutSchema } from "@/lib/validators";

const goodItems = [
  { productId: "p1", slug: "ao", name: "Áo", priceVnd: 100000, qty: 1 },
];

describe("checkoutSchema", () => {
  it("chuẩn hoá số điện thoại +84 -> 0", () => {
    const r = checkoutSchema.safeParse({
      customerName: "Nguyễn Văn A",
      phone: "+84912345678",
      address: "12 Nguyễn Huệ, Quận 1, TP.HCM",
      paymentMethod: "cod",
      items: goodItems,
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.phone).toBe("0912345678");
  });

  it("từ chối SĐT sai định dạng", () => {
    const r = checkoutSchema.safeParse({
      customerName: "A B",
      phone: "12345",
      address: "địa chỉ đủ dài để hợp lệ",
      paymentMethod: "cod",
      items: goodItems,
    });
    expect(r.success).toBe(false);
  });

  it("từ chối giỏ hàng trống", () => {
    const r = checkoutSchema.safeParse({
      customerName: "A B",
      phone: "0912345678",
      address: "địa chỉ đủ dài để hợp lệ",
      paymentMethod: "cod",
      items: [],
    });
    expect(r.success).toBe(false);
  });

  it("email rỗng -> undefined (hợp lệ)", () => {
    const r = checkoutSchema.safeParse({
      customerName: "A B",
      phone: "0912345678",
      email: "",
      address: "địa chỉ đủ dài để hợp lệ",
      paymentMethod: "bank_transfer",
      items: goodItems,
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBeUndefined();
  });
});
