import { describe, it, expect, vi, beforeEach } from "vitest";
import type { CheckoutInput } from "@/lib/validators";

vi.mock("server-only", () => ({}));

const productFindManyMock = vi.fn();
const productVariantUpdateManyMock = vi.fn();
const orderCreateMock = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    product: {
      findMany: (...args: unknown[]) => productFindManyMock(...args),
    },
    $transaction: async (cb: (tx: unknown) => unknown) => {
      const tx = {
        productVariant: {
          updateMany: (...args: unknown[]) => productVariantUpdateManyMock(...args),
        },
        order: {
          create: (...args: unknown[]) => orderCreateMock(...args),
        },
      };
      return cb(tx);
    },
  },
}));

const { createOrder } = await import("@/lib/orders");

function baseInput(items: CheckoutInput["items"]): CheckoutInput {
  return {
    customerName: "Nguyễn Văn A",
    phone: "0912345678",
    address: "12 Nguyễn Huệ, Quận 1, TP.HCM",
    paymentMethod: "cod",
    items,
  };
}

const product = {
  id: "p1",
  name: "Áo sơ mi",
  slug: "ao-so-mi",
  priceVnd: 100000,
  salePriceVnd: null as number | null,
  isActive: true,
  images: [{ url: "/img/ao.jpg" }],
  variants: [
    { id: "v-s-do", productId: "p1", size: "S", color: "Đỏ", stock: 5 },
    { id: "v-m-do", productId: "p1", size: "M", color: "Đỏ", stock: 0 },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  productFindManyMock.mockResolvedValue([product]);
  productVariantUpdateManyMock.mockResolvedValue({ count: 1 });
  orderCreateMock.mockResolvedValue({});
});

describe("createOrder — trừ tồn kho theo biến thể (size × màu)", () => {
  it("trừ đúng biến thể khách chọn, không đụng biến thể khác cùng sản phẩm", async () => {
    const input = baseInput([
      { productId: "p1", slug: "ao-so-mi", name: "Áo sơ mi", priceVnd: 100000, size: "S", color: "Đỏ", qty: 2 },
    ]);
    const result = await createOrder(input);
    expect(result.ok).toBe(true);
    expect(productVariantUpdateManyMock).toHaveBeenCalledTimes(1);
    expect(productVariantUpdateManyMock).toHaveBeenCalledWith({
      where: { id: "v-s-do", stock: { gte: 2 } },
      data: { stock: { decrement: 2 } },
    });
  });

  it("từ chối khi tổ hợp size/màu đã chọn hết hàng (0 tồn), không đụng transaction", async () => {
    const input = baseInput([
      { productId: "p1", slug: "ao-so-mi", name: "Áo sơ mi", priceVnd: 100000, size: "M", color: "Đỏ", qty: 1 },
    ]);
    const result = await createOrder(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("chỉ còn 0 sản phẩm");
    expect(productVariantUpdateManyMock).not.toHaveBeenCalled();
    expect(orderCreateMock).not.toHaveBeenCalled();
  });

  it("từ chối khi không có biến thể nào khớp size/màu gửi lên (dữ liệu giỏ hàng cũ/không hợp lệ)", async () => {
    const input = baseInput([
      { productId: "p1", slug: "ao-so-mi", name: "Áo sơ mi", priceVnd: 100000, size: "L", color: "Đỏ", qty: 1 },
    ]);
    const result = await createOrder(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toBe("Một sản phẩm trong giỏ không còn khả dụng");
    expect(productVariantUpdateManyMock).not.toHaveBeenCalled();
  });

  it("chuẩn hoá size/color undefined -> \"\" để khớp variant tồn kho chung", async () => {
    const noOptionProduct = {
      ...product,
      variants: [{ id: "v-common", productId: "p1", size: "", color: "", stock: 3 }],
    };
    productFindManyMock.mockResolvedValue([noOptionProduct]);
    const input = baseInput([
      { productId: "p1", slug: "ao-so-mi", name: "Áo sơ mi", priceVnd: 100000, qty: 1 },
    ]);
    const result = await createOrder(input);
    expect(result.ok).toBe(true);
    expect(productVariantUpdateManyMock).toHaveBeenCalledWith({
      where: { id: "v-common", stock: { gte: 1 } },
      data: { stock: { decrement: 1 } },
    });
  });

  it("chống race condition: updateMany trả count=0 (đã bị bán mất trong lúc xử lý) -> báo hết hàng, không tạo đơn", async () => {
    productVariantUpdateManyMock.mockResolvedValueOnce({ count: 0 });
    const input = baseInput([
      { productId: "p1", slug: "ao-so-mi", name: "Áo sơ mi", priceVnd: 100000, size: "S", color: "Đỏ", qty: 1 },
    ]);
    const result = await createOrder(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("vừa hết hàng");
    expect(orderCreateMock).not.toHaveBeenCalled();
  });
});
