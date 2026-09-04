"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconSearch } from "@/components/ui/icons";
import { buildShopHref, type ShopQuery } from "@/lib/shop-query";

/** Ô tìm kiếm trên trang shop — gõ tới đâu, danh sách sản phẩm lọc lại tới đó (debounce ~400ms). */
export function ShopSearchBox({
  query,
  basePath = "/shop",
}: {
  query: ShopQuery;
  basePath?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(query.q ?? "");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Đồng bộ khi từ khoá đổi từ nơi khác (vd. bấm nút xoá từ khoá, back/forward).
  useEffect(() => {
    setValue(query.q ?? "");
  }, [query.q]);

  function commit(next: string) {
    if (timerRef.current) clearTimeout(timerRef.current);
    const trimmed = next.trim();
    if (trimmed === (query.q ?? "")) return;
    router.replace(buildShopHref(query, { q: trimmed || null }, basePath), { scroll: false });
  }

  function handleChange(next: string) {
    setValue(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => commit(next), 400);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div role="search" className="relative">
      <label htmlFor="shop-search-input" className="sr-only">
        Tìm sản phẩm
      </label>
      <IconSearch
        width={16}
        height={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        id="shop-search-input"
        type="search"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit(value);
        }}
        placeholder="Tìm sản phẩm..."
        autoComplete="off"
        className="h-11 w-full rounded-sm border border-line bg-bg pl-9 pr-3 text-sm text-ink placeholder:text-muted transition-colors focus-visible:outline-none focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/15"
      />
    </div>
  );
}
