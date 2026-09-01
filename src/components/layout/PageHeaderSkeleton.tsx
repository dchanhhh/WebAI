import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

/** Khớp bố cục PageHeader.tsx — breadcrumb + eyebrow + h1 (+ mô tả tuỳ chọn). */
export function PageHeaderSkeleton({ withDescription = false }: { withDescription?: boolean }) {
  return (
    <div className="border-b border-line bg-surface">
      <Container className="py-10 lg:py-14">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-4 h-3 w-20" />
        <Skeleton className="mt-2 h-8 w-64 lg:h-9 lg:w-80" />
        {withDescription ? <Skeleton className="mt-3 h-4 w-full max-w-md" /> : null}
      </Container>
    </div>
  );
}
