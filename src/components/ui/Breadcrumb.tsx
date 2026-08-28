import Link from "next/link";
import { Fragment } from "react";

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Đường dẫn" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-accent">
            Trang chủ
          </Link>
        </li>
        {items.map((it, i) => (
          <Fragment key={i}>
            <li aria-hidden className="text-line">
              /
            </li>
            <li>
              {it.href ? (
                <Link href={it.href} className="hover:text-accent">
                  {it.label}
                </Link>
              ) : (
                <span className="text-ink-soft">{it.label}</span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
