import { Skeleton } from "@/components/ui/Skeleton";

/**
 * Khớp bố cục ProductCard.tsx: ảnh aspect-[3/4] không bo góc, tên 2 dòng
 * (mô phỏng line-clamp-2), giá, nút "Thêm vào giỏ" (size=sm => h-9).
 */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[3/4] w-full" />
      <div className="mt-3 flex flex-1 flex-col">
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="mt-1.5 h-4 w-1/2" />
        <Skeleton className="mt-1.5 h-4 w-20" />
        <Skeleton className="mt-3 h-9 w-full rounded-sm" />
      </div>
    </div>
  );
}
