"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useCart, selectCount } from "@/lib/cart-store";
import { IconBag, IconMenu, IconClose, IconSearch, IconUser } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const openCart = useCart((s) => s.open);
  const count = useCart(selectCount);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
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

  return (
    <header className="sticky top-0 z-50 bg-bg">
      <div className="border-b border-line">
        <div className="container flex h-16 items-center justify-between gap-4 lg:h-20">
          <button
            type="button"
            className="grid h-11 w-11 place-items-center text-ink md:hidden"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
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
              onClick={() => setSearchOpen((o) => !o)}
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

      {/* Ô tìm kiếm — mở/đóng bằng nút kính lúp, submit GET tới /shop */}
      <div
        id="header-search-panel"
        aria-hidden={!searchOpen}
        className={cn(
          "grid overflow-hidden border-line bg-bg transition-[grid-template-rows] duration-200 ease-standard",
          searchOpen ? "grid-rows-[1fr] border-b" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <form
            action="/shop"
            method="GET"
            role="search"
            className="container flex items-center gap-2 py-3"
            onSubmit={() => setSearchOpen(false)}
          >
            <label htmlFor="header-search-input" className="sr-only">
              Tìm sản phẩm
            </label>
            <input
              ref={searchInputRef}
              id="header-search-input"
              type="search"
              name="q"
              placeholder="Tìm sản phẩm..."
              tabIndex={searchOpen ? 0 : -1}
              className="h-11 w-full rounded-sm border border-line bg-bg px-3 text-base text-ink placeholder:text-muted transition-colors focus-visible:outline-none focus-visible:border-ink focus-visible:ring-2 focus-visible:ring-ink/15"
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchOpen(false);
              }}
            />
            <button
              type="submit"
              aria-label="Tìm kiếm"
              tabIndex={searchOpen ? 0 : -1}
              className="grid h-11 w-11 shrink-0 place-items-center text-ink hover:text-accent"
            >
              <IconSearch />
            </button>
          </form>
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
