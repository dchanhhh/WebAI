"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] max-w-lg flex-col items-center justify-center py-20 text-center">
      <p className="text-overline text-muted">Đã có lỗi</p>
      <h1 className="mt-3 text-h2 text-ink">Rất tiếc, có gì đó chưa ổn</h1>
      <p className="mt-3 text-muted">Vui lòng thử lại. Nếu lỗi tiếp tục, hãy liên hệ với chúng tôi.</p>
      <div className="mt-8 flex gap-3">
        <Button variant="primary" onClick={reset}>
          Thử lại
        </Button>
        <ButtonLink href="/" variant="secondary">
          Về trang chủ
        </ButtonLink>
      </div>
    </Container>
  );
}
