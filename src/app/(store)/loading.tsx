import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import { SectionHeadingSkeleton } from "@/components/ui/SectionHeadingSkeleton";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";

/**
 * Skeleton dự phòng cho các trang trong (store) chưa có `loading.tsx` riêng
 * (trang chủ, giỏ hàng, thanh toán, giới thiệu, liên hệ, tra cứu đơn…). Các
 * trang này có bố cục rất khác nhau nên khung này mô phỏng trang chủ — nơi
 * gọi nhiều truy vấn DB nhất (LatestCollection, CollectionTiles, BlogTeaser)
 * và dễ chạm skeleton nhất: một khối hero + các dải section xen kẽ nền
 * (design.md "nhịp nền bg → surface → bg"), thay vì giả một lưới sản phẩm cố
 * định như trước — vốn sai hoàn toàn với những trang không có lưới.
 */
export default function Loading() {
  return (
    <>
      <Skeleton className="min-h-[420px] w-full md:min-h-[560px] lg:min-h-[640px]" />

      <section className="py-16 lg:py-24">
        <Container>
          <SectionHeadingSkeleton />
          <ProductGridSkeleton count={4} />
        </Container>
      </section>

      <section className="bg-surface py-16 lg:py-24">
        <Container>
          <SectionHeadingSkeleton />
          <ProductGridSkeleton count={4} />
        </Container>
      </section>
    </>
  );
}
