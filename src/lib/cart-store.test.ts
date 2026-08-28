import { describe, it, expect, beforeEach } from "vitest";
import { useCart, selectCount, selectSubtotal } from "@/lib/cart-store";

const base = {
  productId: "p1",
  slug: "ao-thun",
  name: "Áo thun",
  priceVnd: 100000,
};

describe("cart-store", () => {
  beforeEach(() => useCart.getState().clear());

  it("thêm sản phẩm mới vào giỏ", () => {
    useCart.getState().add(base, 2);
    const s = useCart.getState();
    expect(s.items).toHaveLength(1);
    expect(s.items[0].qty).toBe(2);
    expect(selectCount(s)).toBe(2);
    expect(selectSubtotal(s)).toBe(200000);
  });

  it("gộp dòng trùng (cùng product + size + color)", () => {
    useCart.getState().add({ ...base, size: "M" }, 1);
    useCart.getState().add({ ...base, size: "M" }, 3);
    expect(useCart.getState().items).toHaveLength(1);
    expect(useCart.getState().items[0].qty).toBe(4);
  });

  it("không gộp khi khác size", () => {
    useCart.getState().add({ ...base, size: "M" }, 1);
    useCart.getState().add({ ...base, size: "L" }, 1);
    expect(useCart.getState().items).toHaveLength(2);
  });

  it("setQty = 0 sẽ xoá dòng", () => {
    useCart.getState().add({ ...base, size: "M" }, 2);
    const key = "p1::M::";
    useCart.getState().setQty(key, 0);
    expect(useCart.getState().items).toHaveLength(0);
  });

  it("giới hạn số lượng tối đa 99", () => {
    useCart.getState().add(base, 90);
    useCart.getState().add(base, 20);
    expect(useCart.getState().items[0].qty).toBe(99);
  });
});
