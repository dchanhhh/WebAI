import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeadingSkeleton } from "@/components/ui/SectionHeadingSkeleton";
import { ProductGallerySkeleton } from "@/components/product/ProductGallerySkeleton";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";

// Khớp bố cục san-pham/[slug]/page.tsx — breadcrumb, gallery + panel thông
// tin (giá / mô tả / chọn size-màu / nút thêm giỏ), rồi khối "Sản phẩm liên quan".
export default function Loading() {
  return (
    <>
      <Container className="py-8 lg:py-12">
        <Skeleton className="h-4 w-52" />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ProductGallerySkeleton />

          <div>
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-2 h-8 w-3/4 lg:h-9" />
            <Skeleton className="mt-4 h-6 w-32" />

            <div className="mt-6 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="mt-8 space-y-5 border-t border-line pt-8">
              <div>
                <Skeleton className="mb-2 h-3 w-16" />
                <div className="flex gap-2">
                  <Skeleton className="h-11 w-11 rounded-sm" />
                  <Skeleton className="h-11 w-11 rounded-sm" />
                  <Skeleton className="h-11 w-11 rounded-sm" />
                </div>
              </div>
              <Skeleton className="h-[52px] w-full rounded-sm sm:w-48" />
            </div>

            <div className="mt-8 space-y-3 border-t border-line pt-6">
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </Container>

      <section className="bg-surface py-16 lg:py-24">
        <Container>
          <SectionHeadingSkeleton />
          <ProductGridSkeleton count={4} />
        </Container>
      </section>
    </>
  );
}
