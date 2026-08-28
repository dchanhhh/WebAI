"use client";

import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/Field";
import { SORT_OPTIONS } from "@/lib/constants";
import { buildShopHref, type ShopQuery } from "@/lib/shop-query";

export function SortSelect({
  query,
  basePath = "/shop",
}: {
  query: ShopQuery;
  basePath?: string;
}) {
  const router = useRouter();
  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className="whitespace-nowrap">Sắp xếp</span>
      <Select
        value={query.sort}
        onChange={(e) => router.push(buildShopHref(query, { sort: e.target.value }, basePath))}
        className="h-10 w-[190px] text-sm"
        aria-label="Sắp xếp sản phẩm"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </label>
  );
}
