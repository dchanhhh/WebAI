"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useCart, selectCount } from "@/lib/cart-store";
import { IconBag, IconMenu, IconClose, IconSearch, IconUser } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { formatVnd } from "@/lib/money";
import { getSearchSuggestions } from "@/actions/search";
import type { ProductSuggestion } from "@/lib/products";

export function Header() {
  const pathname = usePathname();
  const openCart = useCart((s) => s.open);
  const count = useCart(selectCount);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const latestQueryRef = useRef("");

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setMenuOpen(false);
    closeSearch();
  }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  // Gợi ý sản phẩm tức thời khi gõ (debounce ~250ms, bỏ qua kết quả cũ trả về muộn).
  useEffect(() => {
    const q = query.trim();
    latestQueryRef.current = q;
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      getSearchSuggestions(q).then((results) => {
        if (latestQueryRef.current === q) setSuggestions(results);
      });
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
    setSuggestions([]);
  }

  return (
    <header className="sticky top-0 z-50 bg-bg">
      <div className="border-b border-line">
        <div className="container flex h-16 items-center justify-between gap-4 lg:h-20">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center text-ink md:hidden"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            onClick={() => {
              closeSearch();
              setMenuOpen(true);
            }}
          >
            <IconMenu />
          </button>

          <Link
            href="/"
            className="shrink-0"
            aria-label={`${SITE_NAME} — trang chủ`}
          >
            <Image
              src="/images/logo_light.png"
              alt={SITE_NAME}
              width={1774}
              height={887}
              priority
              className="h-8 w-auto lg:h-10"
            />
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-overline text-ink-soft transition-colors hover:text-accent",
                  pathname === link.href && "text-accent",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label={searchOpen ? "Đóng tìm kiếm" : "Tìm kiếm"}
              aria-expanded={searchOpen}
              aria-controls="header-search-panel"
              onClick={() => {
                if (searchOpen) {
                  closeSearch();
                } else {
                  setMenuOpen(false);
                  setSearchOpen(true);
                }
              }}
              className="grid h-11 w-11 place-items-center text-ink hover:text-accent"
            >
              {searchOpen ? <IconClose /> : <IconSearch />}
            </button>
            <Link
              href="/tra-cuu-don-hang"
              aria-label="Tra cứu đơn hàng"
              className="hidden h-11 w-11 place-items-center text-ink hover:text-accent sm:grid"
            >
              <IconUser />
            </Link>
            <button
              type="button"
              onClick={openCart}
              aria-label="Mở giỏ hàng"
              className="relative grid h-11 w-11 place-items-center text-ink hover:text-accent"
            >
              <IconBag />
              {mounted && count > 0 ? (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-medium leading-none text-accent-fg">
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>

      {/* Lớp bấm-ra-ngoài-để-đóng phía sau panel tìm kiếm (trong suốt) */}
      <button
        type="button"
        aria-label="Đóng tìm kiếm"
        tabIndex={-1}
        onClick={() => closeSearch()}
        className={cn("fixed inset-0 z-40", searchOpen ? "" : "pointer-events-none")}
      />

      {/* Ô tìm kiếm — khối nhỏ nổi đè lên nội dung bên dưới, không có nền toàn chiều ngang */}
      <div
        id="header-search-panel"
        aria-hidden={!searchOpen}
        className="pointer-events-none absolute inset-x-0 top-full z-50"
      >
        <div className="container flex justify-center py-3 sm:justify-end">
          <div
            className={cn(
              "pointer-events-auto w-full max-w-sm border border-line bg-bg shadow-xl transition-[opacity,transform] duration-[240ms] ease-standard motion-reduce:transition-none",
              searchOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
            )}
          >
            <form
              action="/shop"
              method="GET"
              role="search"
              className="flex items-center gap-2 p-3"
            >
              <label htmlFor="header-search-input" className="sr-only">
                Tìm sản phẩm
              </label>
              <input
                ref={searchInputRef}
                id="header-search-input"
                type="search"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm sản phẩm..."
                autoComplete="off"
                tabIndex={searchOpen ? 0 : -1}
                className="h-11 w-full rounded-sm border border-line bg-bg px-3 text-sm text-ink placeholder:text-muted transition-colors focus-visible:outline-none focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/15"
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeSearch();
                }}
              />
              <button
                type="submit"
                aria-label="Tìm kiếm"
                tabIndex={searchOpen ? 0 : -1}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-sm bg-ink text-bg transition-colors hover:bg-ink-soft"
              >
                <IconSearch width={17} height={17} />
              </button>
            </form>

            {suggestions.length > 0 ? (
              <ul
                id="header-search-suggestions"
                aria-label="Sản phẩm gợi ý"
                className="divide-y divide-line border-t border-line"
              >
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/san-pham/${p.slug}`}
                      onClick={() => closeSearch()}
                      tabIndex={searchOpen ? 0 : -1}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-surface"
                    >
                      <span className="relative block aspect-[3/4] w-10 shrink-0 overflow-hidden bg-surface">
                        {p.imageUrl ? (
                          <Image src={p.imageUrl} alt="" fill sizes="40px" className="object-cover" />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-ink">{p.name}</span>
                        <span className="mt-0.5 flex items-center gap-1.5">
                          <span className="text-sm font-medium text-ink">
                            {formatVnd(p.salePriceVnd ?? p.priceVnd)}
                          </span>
                          {p.salePriceVnd ? (
                            <span className="text-xs text-muted line-through">
                              {formatVnd(p.priceVnd)}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : query.trim().length >= 2 ? (
              <p className="border-t border-line px-3 py-3 text-sm text-muted">
                Không tìm thấy sản phẩm phù hợp.
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 md:hidden", menuOpen ? "" : "pointer-events-none")}>
        <button
          type="button"
          aria-label="Đóng menu"
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/40 transition-opacity duration-200",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute left-0 top-0 flex h-full w-[82%] max-w-[320px] flex-col bg-bg transition-transform duration-[240ms] ease-standard",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <Image
              src="/images/logo_light.png"
              alt={SITE_NAME}
              width={1774}
              height={887}
              className="h-7 w-auto"
            />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Đóng"
              className="grid h-11 w-11 place-items-center text-ink"
            >
              <IconClose />
            </button>
          </div>
          <nav className="flex flex-col px-2 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-3 text-overline text-ink-soft hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/tra-cuu-don-hang"
              className="px-3 py-3 text-overline text-ink-soft hover:text-accent"
            >
              Tra cứu đơn hàng
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
