import Link from "next/link";
import type { Category } from "@prisma/client";
import { cn } from "@/lib/utils";
import { IconClose } from "@/components/ui/icons";
import {
  PRICE_BUCKETS,
  buildShopHref,
  type ShopQuery,
} from "@/lib/shop-query";

function Row({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "block py-1.5 text-sm transition-colors",
          active ? "font-medium text-accent" : "text-ink-soft hover:text-accent",
        )}
      >
        {children}
      </Link>
    </li>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <p className="text-overline text-ink">{title}</p>
      <ul className="mt-3">{children}</ul>
    </div>
  );
}

export function ShopFilters({
  categories,
  query,
  basePath = "/shop",
}: {
  categories: Category[];
  query: ShopQuery;
  basePath?: string;
}) {
  const inner = (
    <>
      {query.q ? (
        <Group title="Từ khoá">
          <li className="flex items-center justify-between gap-2 py-1">
            <span className="truncate text-sm text-ink-soft" title={query.q}>
              “{query.q}”
            </span>
            <Link
              href={buildShopHref(query, { q: null }, basePath)}
              aria-label={`Xoá từ khoá "${query.q}"`}
              className="grid h-11 w-11 shrink-0 -my-2 -mr-3 place-items-center text-ink-soft hover:text-accent"
            >
              <IconClose />
            </Link>
          </li>
        </Group>
      ) : null}

      <Group title="Danh mục">
        <Row href={buildShopHref(query, { category: null }, basePath)} active={!query.category}>
          Tất cả sản phẩm
        </Row>
        {categories.map((c) => (
          <Row
            key={c.id}
            href={buildShopHref(query, { category: c.slug }, basePath)}
            active={query.category === c.slug}
          >
            {c.name}
          </Row>
        ))}
      </Group>

      <Group title="Khoảng giá">
        <Row href={buildShopHref(query, { price: null }, basePath)} active={!query.price}>
          Tất cả mức giá
        </Row>
        {PRICE_BUCKETS.map((b) => (
          <Row
            key={b.key}
            href={buildShopHref(query, { price: b.key }, basePath)}
            active={query.price === b.key}
          >
            {b.label}
          </Row>
        ))}
      </Group>

      <Group title="Khác">
        <Row
          href={buildShopHref(query, { onSale: !query.onSale }, basePath)}
          active={query.onSale}
        >
          Đang khuyến mãi
        </Row>
        <Row href={buildShopHref(query, { isNew: !query.isNew }, basePath)} active={query.isNew}>
          Hàng mới về
        </Row>
      </Group>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block">{inner}</aside>
      {/* Mobile: dùng <details> — hoạt động không cần JS */}
      <details className="lg:hidden">
        <summary className="flex h-11 cursor-pointer list-none items-center justify-between border border-line px-4 text-overline text-ink">
          Bộ lọc
          <span aria-hidden>+</span>
        </summary>
        <div className="mt-3 border border-line px-4 py-2">{inner}</div>
      </details>
    </>
  );
}
