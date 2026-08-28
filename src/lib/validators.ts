import { z } from "zod";

/** SĐT Việt Nam: 10 số, bắt đầu bằng 0; cho phép +84. */
const phoneVn = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s.]/g, "").replace(/^\+84/, "0"))
  .pipe(z.string().regex(/^0\d{9}$/, "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0)"));

export const cartLineSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  priceVnd: z.number().int().nonnegative(),
  imageUrl: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  qty: z.number().int().min(1).max(99),
});
export type CartLineInput = z.infer<typeof cartLineSchema>;

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Vui lòng nhập họ tên").max(80),
  phone: phoneVn,
  email: z
    .string()
    .trim()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  address: z.string().trim().min(8, "Vui lòng nhập địa chỉ đầy đủ").max(300),
  note: z.string().trim().max(500).optional(),
  paymentMethod: z.enum(["cod", "bank_transfer"], {
    errorMap: () => ({ message: "Chọn phương thức thanh toán" }),
  }),
  items: z.array(cartLineSchema).min(1, "Giỏ hàng đang trống"),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const orderLookupSchema = z.object({
  code: z.string().trim().min(4, "Nhập mã đơn hàng").max(24),
  phone: phoneVn,
});

export const loginSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z.string().min(1, "Nhập mật khẩu"),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
});

const intFromString = z
  .union([z.string(), z.number()])
  .transform((v) => (typeof v === "number" ? v : Number(String(v).replace(/[^\d]/g, ""))))
  .pipe(z.number().int().nonnegative());

export const productSchema = z
  .object({
    name: z.string().trim().min(2, "Nhập tên sản phẩm").max(120),
    slug: z.string().trim().optional(),
    description: z.string().trim().min(10, "Mô tả quá ngắn").max(4000),
    categoryId: z.string().min(1, "Chọn danh mục"),
    priceVnd: intFromString.refine((v) => v > 0, "Giá phải lớn hơn 0"),
    salePriceVnd: z
      .union([z.string(), z.number(), z.null(), z.undefined()])
      .transform((v) => {
        if (v === null || v === undefined || v === "") return null;
        const n = typeof v === "number" ? v : Number(String(v).replace(/[^\d]/g, ""));
        return Number.isFinite(n) && n > 0 ? n : null;
      }),
    stock: intFromString,
    sizes: z.array(z.string().trim().min(1)).default([]),
    colors: z.array(z.string().trim().min(1)).default([]),
    images: z.array(z.string().trim().min(1)).default([]),
    isActive: z.boolean().default(true),
    isNew: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
  })
  .refine((d) => d.salePriceVnd == null || d.salePriceVnd < d.priceVnd, {
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
    path: ["salePriceVnd"],
  });
export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Nhập tên danh mục").max(80),
  slug: z.string().trim().optional(),
  description: z.string().trim().max(500).optional(),
  imageUrl: z.string().trim().optional(),
  sortOrder: intFromString.default(0),
});
export type CategoryInput = z.infer<typeof categorySchema>;
