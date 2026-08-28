import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-20 text-center">
      <p className="text-overline text-muted">Lỗi 404</p>
      <h1 className="mt-3 text-h2 text-ink">Không tìm thấy trang</h1>
      <p className="mt-3 text-muted">
        Trang bạn tìm có thể đã được chuyển hoặc không còn tồn tại.
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/" variant="primary">
          Về trang chủ
        </ButtonLink>
        <ButtonLink href="/shop" variant="secondary">
          Xem sản phẩm
        </ButtonLink>
      </div>
    </Container>
  );
}
