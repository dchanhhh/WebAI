import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-surface">
      {/* Ảnh nền tràn viền phải (desktop) */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[56%] md:block">
        <Image
          src="/images/hero.svg"
          alt="Người mẫu trong trang phục dự tiệc của Nhà May"
          fill
          priority
          sizes="56vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface to-transparent" />
      </div>

      {/* Ảnh dạng dải trên cùng (mobile) */}
      <div className="relative aspect-[4/3] w-full md:hidden">
        <Image
          src="/images/hero.svg"
          alt="Người mẫu trong trang phục dự tiệc của Nhà May"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
      </div>

      <Container className="relative flex min-h-[420px] flex-col justify-center py-12 md:min-h-[560px] md:py-24 lg:min-h-[640px]">
        <div className="max-w-xl md:max-w-md lg:max-w-xl">
          <h1 className="text-hero text-ink">
            Trang phục
            <br />
            dự tiệc
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-soft">
            Những thiết kế tối giản, phom dáng tôn người mặc trên chất liệu chọn lọc — sẵn sàng cho
            mọi buổi hẹn quan trọng.
          </p>
          <div className="mt-8">
            <ButtonLink href="/shop" variant="primary" size="lg">
              Xem bộ sưu tập
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
