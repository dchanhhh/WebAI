import { SORT_OPTIONS } from "@/lib/constants";

export type RawSearchParams = Record<string, string | string[] | undefined>;

export type ShopQuery = {
  category?: string;
  sort: string;
  price?: string; // key của PRICE_BUCKETS
  onSale: boolean;
  isNew: boolean;
  q?: string;
  page: number;
};

export const PRICE_BUCKETS: { key: string; label: string; min?: number; max?: number }[] = [
  { key: "duoi-300", label: "Dưới 300.000 ₫", max: 300000 },
  { key: "300-600", label: "300.000 – 600.000 ₫", min: 300000, max: 600000 },
  { key: "600-1tr", label: "600.000 – 1.000.000 ₫", min: 600000, max: 1000000 },
  { key: "tren-1tr", label: "Trên 1.000.000 ₫", min: 1000000 },
];

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export function parseShopQuery(sp: RawSearchParams): ShopQuery {
  const sort = SORT_OPTIONS.some((o) => o.value === first(sp.sort))
    ? (first(sp.sort) as string)
    : "moi-nhat";
  const priceKey = PRICE_BUCKETS.find((b) => b.key === first(sp.price))?.key;
  const page = Math.max(1, Number.parseInt(first(sp.page) ?? "1", 10) || 1);
  return {
    category: first(sp.category) || undefined,
    sort,
    price: priceKey,
    onSale: first(sp["on-sale"]) === "1",
    isNew: first(sp.new) === "1",
    q: first(sp.q)?.trim() || undefined,
    page,
  };
}

export function priceBounds(key?: string) {
  const b = PRICE_BUCKETS.find((x) => x.key === key);
  return { priceMin: b?.min, priceMax: b?.max };
}

/** Xây query string mới, ghi đè các khoá được truyền, xoá khoá có giá trị null. */
export function buildShopHref(
  current: ShopQuery,
  patch: Partial<Record<keyof ShopQuery, string | number | boolean | null>>,
  basePath = "/shop",
): string {
  const params = new URLSearchParams();
  const merged: Record<string, unknown> = {
    category: current.category,
    sort: current.sort === "moi-nhat" ? undefined : current.sort,
    price: current.price,
    "on-sale": current.onSale ? "1" : undefined,
    new: current.isNew ? "1" : undefined,
    q: current.q,
    page: current.page > 1 ? current.page : undefined,
  };
  for (const [k, v] of Object.entries(patch)) {
    const key = k === "onSale" ? "on-sale" : k === "isNew" ? "new" : k;
    merged[key] = v === false || v === null || v === "" ? undefined : v === true ? "1" : v;
  }
  // Đổi bộ lọc -> quay lại trang 1 (trừ khi chính patch đổi page)
  if (!("page" in patch)) merged.page = undefined;

  for (const [k, v] of Object.entries(merged)) {
    if (v != null) params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
