import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

// Khớp bố cục blog/[slug]/page.tsx — breadcrumb, ngày, tiêu đề, ảnh bìa
// aspect-[3/2], đoạn trích, rồi các dòng nội dung markdown.
export default function Loading() {
  return (
    <Container className="max-w-3xl py-10 lg:py-14">
      <Skeleton className="h-4 w-48" />
      <div className="mt-8">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-8 w-full lg:h-9" />
        <Skeleton className="mt-6 aspect-[3/2] w-full" />
        <Skeleton className="mt-6 h-5 w-3/4" />
        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </Container>
  );
}
