import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { PageHeaderSkeleton } from "@/components/layout/PageHeaderSkeleton";
import { ShopFiltersSkeleton } from "@/components/product/ShopFiltersSkeleton";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";

/**
 * Khớp bố cục trang danh sách sản phẩm — dùng chung cho `shop/page.tsx` và
 * `danh-muc/[slug]/page.tsx` (cùng một layout: PageHeader + bộ lọc + lưới).
 */
export function ShopPageSkeleton() {
  return (
    <>
      <PageHeaderSkeleton />
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <ShopFiltersSkeleton />
          <div>
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-[190px] rounded-sm" />
            </div>
            <ProductGridSkeleton />
          </div>
        </div>
      </Container>
    </>
  );
}
