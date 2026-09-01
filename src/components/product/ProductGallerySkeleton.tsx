import { Skeleton } from "@/components/ui/Skeleton";

/** Khớp bố cục ProductGallery.tsx — cột thumbnail + ảnh chính, cùng aspect-[3/4]. */
export function ProductGallerySkeleton() {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      <div className="flex gap-3 sm:flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-16 flex-none sm:w-20" />
        ))}
      </div>
      <Skeleton className="aspect-[3/4] w-full" />
    </div>
  );
}
