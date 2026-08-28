"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logoutAction } from "@/actions/admin";
import { SITE_NAME } from "@/lib/constants";
import { IconMenu, IconClose } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Tổng quan", exact: true },
  { href: "/admin/san-pham", label: "Sản phẩm" },
  { href: "/admin/danh-muc", label: "Danh mục" },
  { href: "/admin/don-hang", label: "Đơn hàng" },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1">
      {LINKS.map((l) => {
        const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={cn(
              "rounded-sm px-3 py-2 text-sm transition-colors",
              active ? "bg-ink text-bg" : "text-ink-soft hover:bg-surface",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-line p-5 lg:block">
        <Link href="/admin" className="text-h4 text-ink">
          {SITE_NAME} <span className="text-muted">Admin</span>
        </Link>
        <div className="mt-6">{nav}</div>
        <div className="mt-6 border-t border-line pt-4 text-sm">
          <p className="truncate text-muted">{email}</p>
          <form action={logoutAction} className="mt-2">
            <button className="text-ink underline-offset-4 hover:underline">Đăng xuất</button>
          </form>
          <Link href="/" className="mt-2 block text-muted hover:text-accent" target="_blank">
            Xem cửa hàng ↗
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3 lg:hidden">
        <Link href="/admin" className="text-h4 text-ink">
          {SITE_NAME} <span className="text-muted">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Mở menu quản trị"
          className="grid h-10 w-10 place-items-center"
        >
          <IconMenu />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Đóng"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-bg p-5">
            <div className="flex items-center justify-between">
              <span className="text-h4 text-ink">Quản trị</span>
              <button onClick={() => setOpen(false)} aria-label="Đóng" className="grid h-10 w-10 place-items-center">
                <IconClose />
              </button>
            </div>
            <div className="mt-6">{nav}</div>
            <form action={logoutAction} className="mt-6 border-t border-line pt-4">
              <button className="text-sm text-ink underline-offset-4 hover:underline">Đăng xuất</button>
            </form>
          </div>
        </div>
      ) : null}

      <main className="p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}
