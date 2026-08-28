export const SITE_NAME = "Nhà May";
export const SITE_TAGLINE = "Thời trang thiết kế tối giản";
export const SITE_DESCRIPTION =
  "Nhà May — thương hiệu thời trang thiết kế tối giản: đầm, áo, chân váy và phụ kiện chọn lọc, may đo tinh tế trên chất liệu bền đẹp.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SHIPPING_FEE_VND = Number(process.env.SHIPPING_FEE_VND ?? 30000);
export const FREE_SHIPPING_THRESHOLD_VND = Number(
  process.env.FREE_SHIPPING_THRESHOLD_VND ?? 500000,
);

export const BANK_INFO = {
  bankName: process.env.BANK_NAME ?? "Vietcombank",
  accountName: process.env.BANK_ACCOUNT_NAME ?? "CONG TY TNHH NHA MAY",
  accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "0123456789",
  branch: process.env.BANK_BRANCH ?? "Chi nhánh TP. Hồ Chí Minh",
};

export const CONTACT = {
  address: "48 Lê Lợi, phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
  phone: "1900 1234",
  phoneHref: "tel:19001234",
  email: "cskh@nhamay.vn",
};

/** Điều hướng chính — xem design.md §2.4 (VIẾT HOA + letter-spacing rộng). */
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Sản phẩm", href: "/shop" },
  { label: "Hàng mới về", href: "/shop?sort=moi-nhat" },
  { label: "Bộ sưu tập", href: "/#bo-suu-tap" },
  { label: "Blog", href: "/blog" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
];

export const ORDER_STATUS = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã huỷ",
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;
export const ORDER_STATUS_KEYS = Object.keys(ORDER_STATUS) as OrderStatus[];

export const PAYMENT_METHOD = {
  cod: "Thanh toán khi nhận hàng (COD)",
  bank_transfer: "Chuyển khoản ngân hàng",
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHOD;

export const SORT_OPTIONS = [
  { value: "moi-nhat", label: "Mới nhất" },
  { value: "gia-tang", label: "Giá: Thấp đến cao" },
  { value: "gia-giam", label: "Giá: Cao đến thấp" },
  { value: "ten-az", label: "Tên: A → Z" },
] as const;

export const PAGE_SIZE = 12;
