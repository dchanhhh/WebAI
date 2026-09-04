import "server-only";
import { prisma } from "@/lib/prisma";
import { calcShippingFee } from "@/lib/shipping";
import type { CheckoutInput } from "@/lib/validators";

export { calcShippingFee };

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateOrderCode(): string {
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return `NM-${s}`;
}

export type CreateOrderResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

/**
 * Tạo đơn hàng. KHÔNG tin dữ liệu client:
 * - đọc lại giá + tồn kho từ DB
 * - tính lại tiền phía server
 * - chạy trong transaction, trừ tồn kho
 */
export async function createOrder(input: CheckoutInput): Promise<CreateOrderResult> {
  const productIds = [...new Set(input.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      variants: true,
    },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  type Line = {
    product: (typeof products)[number];
    variantId: string;
    qty: number;
    size?: string;
    color?: string;
    unitPriceVnd: number;
  };
  const valid: Line[] = [];
  for (const item of input.items) {
    const p = byId.get(item.productId);
    if (!p) return { ok: false, error: "Một sản phẩm trong giỏ không còn khả dụng" };
    // Chuẩn hoá undefined -> "" để khớp với quy ước lưu variant trong DB.
    const size = item.size ?? "";
    const color = item.color ?? "";
    const variant = p.variants.find((v) => v.size === size && v.color === color);
    if (!variant) return { ok: false, error: "Một sản phẩm trong giỏ không còn khả dụng" };
    if (variant.stock < item.qty) {
      return { ok: false, error: `"${p.name}" chỉ còn ${variant.stock} sản phẩm` };
    }
    valid.push({
      product: p,
      variantId: variant.id,
      qty: item.qty,
      size: item.size,
      color: item.color,
      unitPriceVnd: p.salePriceVnd ?? p.priceVnd,
    });
  }

  const subtotalVnd = valid.reduce((s, l) => s + l.unitPriceVnd * l.qty, 0);
  const shippingFeeVnd = calcShippingFee(subtotalVnd);
  const totalVnd = subtotalVnd + shippingFeeVnd;

  // Sinh mã đơn, thử lại nếu trùng (hiếm).
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateOrderCode();
    try {
      await prisma.$transaction(async (tx) => {
        for (const l of valid) {
          const updated = await tx.productVariant.updateMany({
            where: { id: l.variantId, stock: { gte: l.qty } },
            data: { stock: { decrement: l.qty } },
          });
          if (updated.count === 0) {
            throw new Error(`OUT_OF_STOCK::${l.product.name}`);
          }
        }
        await tx.order.create({
          data: {
            code,
            customerName: input.customerName,
            phone: input.phone,
            email: input.email ?? null,
            address: input.address,
            note: input.note ?? null,
            paymentMethod: input.paymentMethod,
            status: "pending",
            subtotalVnd,
            shippingFeeVnd,
            totalVnd,
            items: {
              create: valid.map((l) => ({
                productId: l.product.id,
                productName: l.product.name,
                productSlug: l.product.slug,
                imageUrl: l.product.images[0]?.url ?? null,
                unitPriceVnd: l.unitPriceVnd,
                quantity: l.qty,
                size: l.size ?? null,
                color: l.color ?? null,
              })),
            },
          },
        });
      });
      return { ok: true, code };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.startsWith("OUT_OF_STOCK::")) {
        return { ok: false, error: `"${msg.split("::")[1]}" vừa hết hàng` };
      }
      // Trùng mã đơn -> thử vòng lặp tiếp theo; lỗi khác -> ném ra.
      if (!/Unique constraint|code/.test(msg)) throw e;
    }
  }
  return { ok: false, error: "Không tạo được mã đơn, vui lòng thử lại" };
}

export async function getOrderByCode(code: string) {
  return prisma.order.findUnique({
    where: { code: code.trim().toUpperCase() },
    include: { items: true },
  });
}
