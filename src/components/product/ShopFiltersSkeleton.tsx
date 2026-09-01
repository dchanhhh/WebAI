import { Skeleton } from "@/components/ui/Skeleton";

function GroupSkeleton({ rows }: { rows: number }) {
  return (
    <div className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <Skeleton className="h-3 w-20" />
      <ul className="mt-3 space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <li key={i}>
            <Skeleton className={i === 0 ? "h-4 w-24" : "h-4 w-32"} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Khớp bố cục ShopFilters.tsx: 3 nhóm (Danh mục / Khoảng giá / Khác) ở desktop,
 * thanh "Bộ lọc" gộp lại ở mobile (`<details>` thật ẩn dưới `lg:hidden`).
 */
export function ShopFiltersSkeleton() {
  return (
    <>
      <aside className="hidden lg:block">
        <GroupSkeleton rows={4} />
        <GroupSkeleton rows={5} />
        <GroupSkeleton rows={2} />
      </aside>
      <Skeleton className="h-11 w-full lg:hidden" />
    </>
  );
}
