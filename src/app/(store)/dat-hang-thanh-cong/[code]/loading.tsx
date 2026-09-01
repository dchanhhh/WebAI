import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

// Khớp bố cục dat-hang-thanh-cong/[code]/page.tsx — icon xác nhận, tiêu đề,
// mô tả, khối thanh toán/tóm tắt đơn, 2 nút hành động.
export default function Loading() {
  return (
    <Container className="max-w-3xl py-14 lg:py-20">
      <div className="flex flex-col items-center text-center">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="mt-5 h-8 w-72 lg:h-9" />
        <Skeleton className="mt-3 h-4 w-full max-w-sm" />
        <Skeleton className="mt-2 h-4 w-2/3 max-w-xs" />
      </div>

      <div className="mt-10 space-y-6">
        <Skeleton className="h-32 w-full rounded-sm" />
        <Skeleton className="h-64 w-full rounded-sm" />
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Skeleton className="h-11 w-40 rounded-sm" />
        <Skeleton className="h-11 w-40 rounded-sm" />
      </div>
    </Container>
  );
}
