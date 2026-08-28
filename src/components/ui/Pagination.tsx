import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
  }

  const cell =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-sm border px-3 text-sm transition-colors";

  return (
    <nav aria-label="Phân trang" className="mt-12 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={makeHref(page - 1)} className={cn(cell, "border-line text-ink hover:border-ink")}>
          Trước
        </Link>
      ) : null}
      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {gap ? <span className="px-1 text-muted">…</span> : null}
            <Link
              href={makeHref(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                cell,
                p === page
                  ? "border-ink bg-ink text-bg"
                  : "border-line text-ink hover:border-ink",
              )}
            >
              {p}
            </Link>
          </span>
        );
      })}
      {page < totalPages ? (
        <Link href={makeHref(page + 1)} className={cn(cell, "border-line text-ink hover:border-ink")}>
          Sau
        </Link>
      ) : null}
    </nav>
  );
}
