import { Container } from "@/components/ui/Container";
import { PageHeaderSkeleton } from "@/components/layout/PageHeaderSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

// Khớp bố cục blog/page.tsx — lưới bài viết md:2 -> lg:3, mỗi thẻ có ảnh bìa
// aspect-[3/2], ngày đăng, tiêu đề, đoạn trích.
export default function Loading() {
  return (
    <>
      <PageHeaderSkeleton withDescription />
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[3/2] w-full" />
              <Skeleton className="mt-3 h-3 w-24" />
              <Skeleton className="mt-1 h-5 w-4/5" />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
